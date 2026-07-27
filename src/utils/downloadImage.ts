const isIOSDevice = () => {
  if ('userAgentData' in navigator) {
    const uaData = (navigator as any).userAgentData
    if (uaData?.platform) return uaData.platform === 'iOS'
  }

  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const isIPadOS = navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent)

  return isAppleMobile || isIPadOS
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: blob.type || 'image/png' })
  const canShareFile =
    typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

  if (isIOSDevice() && canShareFile) {
    try {
      await navigator.share({ files: [file], title: filename })
      return
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
      return
    }
  }

  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
