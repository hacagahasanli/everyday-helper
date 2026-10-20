import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { toDataUrl } from '../../utils/convert-utils';
import {
  downloadUrl,
  downloadBlob,
  formatFileSize,
  fetchAndDownload,
  getFileExtension,
} from '../../utils/file-utils';

describe('formatFileSize', () => {
  it('formats bytes with 1024-based units', () => {
    expect(formatFileSize(500)).toBe('500B');
    expect(formatFileSize(1536)).toBe('1.5KB');
    expect(formatFileSize(1048576)).toBe('1MB');
    expect(formatFileSize(5 * 1024 ** 3)).toBe('5GB');
  });

  it('supports decimals and separator options', () => {
    expect(formatFileSize(1300000, { decimals: 2, separator: ' ' })).toBe('1.24 MB');
  });

  it('caps at the largest unit', () => {
    expect(formatFileSize(2 * 1024 ** 5)).toBe('2048TB');
  });

  it.each([0, null, undefined, -10])('returns 0B for %s', (bytes) => {
    expect(formatFileSize(bytes)).toBe('0B');
  });
});

describe('getFileExtension', () => {
  it('returns the last extension in upper case', () => {
    expect(getFileExtension('report.final.pdf')).toBe('PDF');
  });

  it('returns lower case when requested', () => {
    expect(getFileExtension('photo.JPG', { uppercase: false })).toBe('jpg');
  });

  it.each(['README', '.env', 'archive.', '', null, undefined])(
    'returns an empty string when there is no extension (%s)',
    (fileName) => {
      expect(getFileExtension(fileName)).toBe('');
    },
  );
});

describe('toDataUrl', () => {
  it('wraps raw base64 as a JPEG data URL by default', () => {
    expect(toDataUrl('abc123')).toBe('data:image/jpeg;base64,abc123');
  });

  it('uses a custom MIME type', () => {
    expect(toDataUrl('abc123', 'image/png')).toBe('data:image/png;base64,abc123');
  });

  it('returns data and http(s) URLs unchanged', () => {
    expect(toDataUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
    expect(toDataUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
  });

  it.each(['', null, undefined])('returns undefined for %s', (src) => {
    expect(toDataUrl(src)).toBeUndefined();
  });
});

describe('downloads', () => {
  let clickedLinks: HTMLAnchorElement[];

  beforeEach(() => {
    clickedLinks = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedLinks.push(this);
    });
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('downloadUrl', () => {
    it('clicks a temporary link with href and download set, then removes it', () => {
      downloadUrl('https://example.com/file.pdf', 'file.pdf');

      expect(clickedLinks).toHaveLength(1);
      expect(clickedLinks[0].href).toBe('https://example.com/file.pdf');
      expect(clickedLinks[0].download).toBe('file.pdf');
      expect(document.querySelector('a[download]')).toBeNull();
    });
  });

  describe('downloadBlob', () => {
    it('downloads through an object URL and revokes it', () => {
      downloadBlob(new Blob(['data']), 'export.xlsx');

      expect(clickedLinks[0].href).toBe('blob:mock-url');
      expect(clickedLinks[0].download).toBe('export.xlsx');
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('fetchAndDownload', () => {
    it('fetches the URL and downloads the response blob', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(['x']) });
      vi.stubGlobal('fetch', fetchMock);

      await fetchAndDownload('https://example.com/a.png', 'a.png');

      expect(fetchMock).toHaveBeenCalledWith('https://example.com/a.png');
      expect(clickedLinks[0].download).toBe('a.png');
    });

    it('calls onError and does not download on a non-2xx response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
      const onError = vi.fn();

      await fetchAndDownload('https://example.com/missing.png', 'missing.png', { onError });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(clickedLinks).toHaveLength(0);
    });

    it('calls onError when the request throws', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
      const onError = vi.fn();

      await fetchAndDownload('https://example.com/a.png', 'a.png', { onError });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('does nothing for an empty URL', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await fetchAndDownload('', 'a.png');

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
