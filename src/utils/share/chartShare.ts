// Lightweight DOM-to-image without external deps
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import html2canvas from 'html2canvas';

function copyComputedStyle(source: Element, target: HTMLElement) {
  const computed = window.getComputedStyle(source as HTMLElement);
  const props = [
    'position','display','top','left','right','bottom','width','height','min-width','min-height','max-width','max-height',
    'margin','padding','gap','inset','transform','transform-origin','opacity','z-index',
    'background','background-color','background-image','background-size','background-position','background-repeat','backdrop-filter',
    'border','border-radius','border-color','border-width','border-style',
    'color','font','font-size','font-weight','font-family','line-height','letter-spacing','text-align','text-shadow',
    'box-shadow','overflow','white-space','flex','flex-direction','align-items','justify-content','grid','grid-template-columns','grid-template-rows'
  ];
  const styleText = props
    .map((p) => {
      const v = computed.getPropertyValue(p);
      return v ? `${p}:${v};` : '';
    })
    .join('');
  (target as HTMLElement).setAttribute('style', styleText);
}

function inlineAllStyles(node: Element): HTMLElement {
  const clone = node.cloneNode(false) as HTMLElement;
  copyComputedStyle(node, clone);

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childClone = inlineAllStyles(child as Element);
      clone.appendChild(childClone);
    } else if (child.nodeType === Node.TEXT_NODE) {
      clone.appendChild(document.createTextNode(child.textContent || ''));
    }
  }
  return clone;
}

async function elementToPngBlob(element: HTMLElement): Promise<Blob> {
  const rect = element.getBoundingClientRect();
  const bg = getComputedStyle(document.body).backgroundColor || '#ffffff';
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: bg,
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  });

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

export async function shareElement(element: HTMLElement, title: string, caption?: string): Promise<void> {
  const blob = await elementToPngBlob(element);
  const dataUrl = await blobToDataURL(blob);
  
  try {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Share plugin for native platforms
      await Share.share({
        title,
        text: caption || title,
        url: dataUrl,
        dialogTitle: 'Share Chart'
      });
      return;
    } else if ('share' in navigator) {
      // Try Web Share API with file first
      try {
        const file = new File([blob], `${title.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });
        if ((navigator as any).canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title, text: caption || title });
          return;
        }
      } catch {}
      
      // Fallback to sharing data URL
      await navigator.share({ title, text: caption || title, url: dataUrl });
      return;
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }

  // Fallback to download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getWeekCaption(weekOffset: number = 0): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek - weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `Week of ${fmt(startOfWeek)} – ${fmt(endOfWeek)}`;
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
