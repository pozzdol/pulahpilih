/**
 * Which device is the visitor on, as far as the installer cares.
 * Pulahpilih ships one Windows x64 installer, which also runs on Windows 11 ARM via emulation.
 */
export type Platform =
	| { kind: 'windows'; label: string }
	| { kind: 'windows-old'; label: string } // Windows 7 / 8 / 8.1
	| { kind: 'windows-32'; label: string }
	| { kind: 'mobile'; label: string } // iOS, iPadOS, Android
	| { kind: 'other'; label: string } // macOS, Linux, ChromeOS
	| { kind: 'unknown'; label: string };

type UAData = {
	platform?: string;
	getHighEntropyValues?: (hints: string[]) => Promise<{ platformVersion?: string; bitness?: string; architecture?: string }>;
};

export function fromUserAgent(ua: string, maxTouchPoints = 0): Platform {
	if (/Android/i.test(ua)) return { kind: 'mobile', label: 'Android' };
	if (/iPhone|iPod/i.test(ua)) return { kind: 'mobile', label: 'iPhone' };
	// iPadOS reports itself as a Mac; touch support gives it away
	if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1)) return { kind: 'mobile', label: 'iPad' };
	if (/CrOS/i.test(ua)) return { kind: 'other', label: 'ChromeOS' };
	if (/Mac OS X|Macintosh/i.test(ua)) return { kind: 'other', label: 'macOS' };
	const nt = ua.match(/Windows NT (\d+\.\d+)/i);
	if (nt) {
		if (parseFloat(nt[1]) < 10) return { kind: 'windows-old', label: `Windows NT ${nt[1]}` };
		// 64-bit Windows shows Win64/x64, or WOW64 for a 32-bit browser on a 64-bit OS
		if (!/Win64|x64|WOW64|amd64|ARM64/i.test(ua)) return { kind: 'windows-32', label: 'Windows 32-bit' };
		return { kind: 'windows', label: 'Windows' };
	}
	if (/Linux|X11/i.test(ua)) return { kind: 'other', label: 'Linux' };
	return { kind: 'unknown', label: '' };
}

/** User-Agent first, then refine Windows with Client Hints where the browser has them (Chrome, Edge). */
export async function detectPlatform(): Promise<Platform> {
	const base = fromUserAgent(navigator.userAgent, navigator.maxTouchPoints);
	const uad = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
	if (base.kind !== 'windows' || !uad?.getHighEntropyValues) return base;
	try {
		const h = await uad.getHighEntropyValues(['platformVersion', 'bitness', 'architecture']);
		if (h.bitness === '32' && h.architecture !== 'arm') return { kind: 'windows-32', label: 'Windows 32-bit' };
		const major = parseInt(h.platformVersion ?? '0', 10);
		if (major >= 13) return { kind: 'windows', label: h.architecture === 'arm' ? 'Windows 11 ARM' : 'Windows 11' };
		if (major > 0) return { kind: 'windows', label: 'Windows 10' };
	} catch {
		// hints refused: the User-Agent answer stands
	}
	return base;
}
