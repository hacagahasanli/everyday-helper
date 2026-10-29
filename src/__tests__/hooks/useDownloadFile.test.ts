import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { renderHook } from '@testing-library/react';

import { useDownloadFile } from '../../hooks/useDownloadFile';

const mockFetch = (response: Partial<Response>) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

const okResponse = (type: string) => ({
  ok: true,
  blob: async () => new Blob(['file'], { type }),
});

describe('useDownloadFile', () => {
  let downloadedNames: string[];

  beforeEach(() => {
    downloadedNames = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadedNames.push(this.download);
    });
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('works without options', async () => {
    mockFetch(okResponse('image/png'));
    const { result } = renderHook(() => useDownloadFile());

    await result.current.downloadImage('/a.png', 'photo');

    expect(downloadedNames).toEqual(['photo.png']);
  });

  it.each([
    ['application/pdf', 'pdf'],
    ['image/jpeg', 'jpg'],
    ['image/webp', 'webp'],
    ['application/pdf;charset=utf-8', 'pdf'],
  ])('takes the extension from the MIME type (%s → .%s)', async (type, extension) => {
    mockFetch(okResponse(type));
    const { result } = renderHook(() => useDownloadFile());

    await result.current.downloadImage('/file', 'Qərar arayışı');

    expect(downloadedNames).toEqual([`Qərar_arayışı.${extension}`]);
  });

  it('falls back to png for an unknown MIME type', async () => {
    mockFetch(okResponse('application/octet-stream'));
    const { result } = renderHook(() => useDownloadFile());

    await result.current.downloadImage('/file', 'file');

    expect(downloadedNames).toEqual(['file.png']);
  });

  it('calls onError instead of alert on a non-2xx response', async () => {
    mockFetch({ ok: false, status: 404 });
    const onError = vi.fn();
    const { result } = renderHook(() => useDownloadFile({ onError }));

    await result.current.downloadImage('/missing', 'file');

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(alert).not.toHaveBeenCalled();
    expect(downloadedNames).toEqual([]);
  });

  it('shows the error message via alert when no onError is given', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    const { result } = renderHook(() => useDownloadFile({ errorMessage: 'Xəta baş verdi' }));

    await result.current.downloadImage('/file', 'file');

    expect(alert).toHaveBeenCalledWith('Xəta baş verdi');
  });
});
