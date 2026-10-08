export const langs = ['id', 'en'] as const;
export type Lang = (typeof langs)[number];

const id = {
	langName: 'Bahasa Indonesia',
	nav: { download: 'Unduh', usecases: 'Kegunaan', guides: 'Artikel', compare: 'Bandingkan', releases: 'Rilis', help: 'Bantuan', privacy: 'Privasi' },
	home: 'Beranda',
	meta: {
		title: 'Pulahpilih: aplikasi sortir foto gratis untuk Windows',
		description:
			'Sortir ratusan foto sampai tersisa yang terbaik. Bandingkan tiga foto sekaligus, pilih dengan tombol panah, dan ulangi sampai jumlahnya pas dengan target.'
	},
	hero: {
		title: 'Sortir ratusan foto sampai tersisa yang terbaik.',
		body: 'Lihat tiga foto sekaligus, tekan → untuk memilih dan ← untuk menolak. Pulahpilih mengulang putaran sampai jumlah foto pas dengan target Anda.',
		download: 'Unduh untuk Windows',
		soon: 'Segera tersedia',
		note: 'Gratis dan open source untuk Windows 10 dan 11',
		notes: 'Lihat catatan rilis'
	},
	demo: {
		label: 'Coba di sini',
		hint: 'Klik jendela ini, lalu pakai ← dan →',
		folder: 'Wisuda 2026',
		modes: { fill: 'Pilih kandidat', reduce: 'Saring pilihan', rescue: 'Tambah dari yang ditolak' },
		ofTarget: (n: number) => `dari target ${n}`,
		round: (n: number) => `Ronde ${n}`,
		reviewing: 'Sedang dinilai',
		next: 'Berikutnya',
		pick: 'Pilih',
		reject: 'Tolak',
		done: (n: number) => `Selesai. ${n} foto terpilih.`,
		again: 'Ulangi demo'
	},
	how: {
		title: 'Cara kerjanya',
		steps: [
			{
				title: 'Pilih kandidat',
				body: 'Semua foto di folder lewat satu per satu. Yang Anda pilih dipindah ke subfolder selected.'
			},
			{
				title: 'Saring pilihan',
				body: 'Kalau pilihan masih lebih banyak dari target, putaran berikutnya hanya menampilkan foto terpilih. Tolak yang kurang bagus.'
			},
			{
				title: 'Tambah dari yang ditolak',
				body: 'Kalau ternyata kurang, foto yang ditolak di putaran terakhir muncul lagi sampai jumlahnya pas.'
			}
		]
	},
	features: {
		title: 'Yang Anda dapat',
		list: [
			{ title: 'Foto RAW ikut', body: 'CR2, CR3, NEF, ARW, DNG dan lainnya. Pasangan RAW+JPG dengan nama sama dipindah bersama.' },
			{ title: 'Perbesar untuk cek detail', body: 'Klik foto atau tekan Spasi. Scroll untuk zoom, geser untuk pindah foto.' },
			{ title: 'Minta bantuan teman', body: 'Bagikan link dengan PIN. Teman menyortir sendiri di browser, Anda yang menyetujui hasilnya.' },
			{ title: 'Salah tekan bisa diurungkan', body: 'Backspace membatalkan keputusan terakhir, termasuk memindah file kembali.' },
			{ title: 'Foto tetap di PC Anda', body: 'Tidak ada upload. Saat berbagi, tamu hanya melihat salinan kecil maksimal 800 KB.' },
			{ title: 'Lanjut kapan saja', body: 'Tutup app di tengah jalan. Buka folder yang sama, sesi berlanjut dari isi folder selected.' }
		]
	},
	downloadSection: {
		title: 'Unduh Pulahpilih',
		version: (v: string) => `Versi ${v}`,
		released: 'Dirilis',
		size: 'Ukuran',
		requires: 'Windows 10 atau 11, 64-bit',
		button: 'Unduh installer',
		none: 'Versi pertama sedang disiapkan. Pantau halaman rilis.',
		smartTitle: 'Muncul "Windows protected your PC"?',
		smartBody:
			'Installer belum ditandatangani sertifikat berbayar, jadi SmartScreen memberi peringatan. Klik "More info", lalu "Run anyway".',
		updates: 'Setelah terpasang, app memberi tahu sendiri kalau ada versi baru.'
	},
	releases: {
		title: 'Catatan rilis',
		lead: 'Semua versi Pulahpilih, aplikasi sortir foto untuk Windows: fitur baru, perbaikan, tanggal rilis dan link unduh tiap versi.',
		latest: 'Terbaru',
		pre: 'Pra-rilis',
		download: 'Unduh',
		github: 'Lihat di GitHub',
		empty: 'Belum ada rilis. Versi pertama sedang disiapkan.'
	},
	docs: {
		title: 'Bantuan',
		lead: 'Cara memakai Pulahpilih: memulai sortir, tombol keyboard, ke mana foto dipindah, berbagi ke teman dan cara memperbarui app.',
		faq: [
			{
				q: 'Bagaimana memulai?',
				a: 'Klik Telusuri untuk memilih folder foto, isi target jumlah foto, pilih urutan, lalu klik Mulai menyortir.'
			},
			{
				q: 'Tombol apa saja yang bisa dipakai?',
				a: '→ atau ↑ untuk memilih, ← atau ↓ untuk menolak, Backspace untuk mengurungkan, Spasi atau Z untuk memperbesar foto. Saat foto diperbesar, panah dipakai untuk pindah foto dan Esc untuk menutup.'
			},
			{
				q: 'Ke mana foto yang dipilih?',
				a: 'Ke subfolder selected di dalam folder yang Anda pilih. Foto yang ditolak tetap di folder awal. Tidak ada file yang dihapus.'
			},
			{
				q: 'Kenapa hasilnya harus pas dengan target?',
				a: 'Supaya Anda tidak perlu menghitung manual. Kalau lebih, app menambah putaran saring. Kalau kurang, foto yang ditolak di putaran terakhir ditampilkan lagi.'
			},
			{
				q: 'Bagaimana cara minta bantuan teman?',
				a: 'Klik Bagikan di toolbar. Setelah sekitar 25 detik muncul link dan PIN. Teman membuka link, memasukkan PIN, menyortir sendiri, lalu mengirim pilihannya. Di app, buka Hasil tamu untuk melihat foto dengan suara terbanyak dan setujui pilihan akhir.'
			},
			{
				q: 'Link berbagi tidak bisa dibuka?',
				a: 'Tunggu sampai link muncul di app; link baru aktif setelah tunnel tersambung. Kalau di PC yang sama muncul ERR_NAME_NOT_RESOLVED, jalankan ipconfig /flushdns lalu coba lagi.'
			},
			{
				q: 'Format apa yang didukung?',
				a: 'JPG, PNG, WebP, serta RAW: CR2, CR3, NEF, ARW, DNG, RAF, ORF, RW2, PEF, SRW. HEIC belum didukung.'
			},
			{
				q: 'Bagaimana memperbarui app?',
				a: 'App mengecek versi baru saat dibuka dan menawarkan tombol Perbarui sekarang. Anda juga bisa mengunduh installer terbaru dari halaman ini.'
			}
		]
	},
	privacy: {
		title: 'Privasi',
		lead: 'Pulahpilih bekerja di PC Anda. Foto tidak dikirim ke server kami, karena kami tidak punya server.',
		points: [
			{ title: 'Tanpa akun dan tanpa pelacakan', body: 'App tidak mengirim statistik pemakaian atau data pribadi.' },
			{
				title: 'Cek pembaruan',
				body: 'Saat dibuka, app mengambil file latest.json dari GitHub untuk mengecek versi baru. Permintaan ini tidak berisi data foto.'
			},
			{
				title: 'Saat berbagi',
				body: 'App membuat tunnel sementara lewat Cloudflare. Tamu yang punya link dan PIN bisa melihat salinan foto yang diperkecil (maksimal 800 KB). File asli tidak pernah dikirim. Berbagi berhenti saat Anda klik Stop berbagi atau menutup app.'
			},
			{ title: 'Situs ini', body: 'Situs ini statis, tanpa cookie dan tanpa analitik.' }
		]
	},
	facts: {
		title: 'Ringkasan',
		price: 'Harga',
		priceValue: 'Gratis, tanpa iklan dan tanpa akun',
		license: 'Lisensi',
		licenseValue: 'Open source, GPL-3.0',
		system: 'Sistem',
		systemValue: 'Windows 10 dan 11, 64-bit',
		formats: 'Format',
		language: 'Bahasa',
		languageValue: 'Indonesia dan English',
		version: 'Versi terbaru',
		maker: 'Pembuat'
	},
	usecaseSection: { title: 'Dipakai untuk', more: 'Semua kegunaan' },
	hubs: {
		usecase: {
			title: 'Kegunaan Pulahpilih',
			lead: 'Contoh alur kerja memilih foto untuk wisuda, pernikahan, event dan foto produk.'
		},
		guide: {
			title: 'Artikel memilih dan menyortir foto',
			lead: 'Cara memilih foto terbaik, menyortir file RAW dan melibatkan orang lain dalam memilih foto.'
		},
		compare: {
			title: 'Bandingkan Pulahpilih',
			lead: 'Perbandingan jujur dengan aplikasi lain untuk memilih dan menyortir foto, termasuk kapan aplikasi lain lebih cocok.'
		}
	},
	doc: {
		updated: 'Diperbarui',
		ctaTitle: 'Coba Pulahpilih',
		ctaBody: 'Gratis dan open source untuk Windows 10 dan 11.',
		ctaButton: 'Unduh Pulahpilih',
		related: 'Baca juga'
	},
	notFound: { title: 'Halaman tidak ditemukan', body: 'Alamatnya mungkin salah ketik atau halamannya sudah dipindah.', home: 'Ke beranda' },
	split: {
		keys: {
			title: 'Tiga foto, satu keputusan',
			body: 'Foto paling kiri sedang dinilai, dua berikutnya sudah terlihat untuk dibandingkan. Tidak perlu membuka foto satu per satu, dan tidak ada yang dihapus: salah tekan cukup diurungkan.',
			keys: [
				{ key: '→', label: 'Pilih foto' },
				{ key: '←', label: 'Tolak foto' },
				{ key: '⌫', label: 'Urungkan, file ikut kembali' },
				{ key: 'Spasi', label: 'Perbesar untuk cek fokus' }
			]
		},
		rounds: {
			title: 'Berhenti tepat di target',
			body: 'Isi target sekali di awal. Pulahpilih mengulang putaran sampai folder selected berisi persis sebanyak itu, tidak lebih dan tidak kurang.',
			example: 'Contoh alur dengan target 30 foto',
			counts: [
				{ n: '240', label: 'foto di folder' },
				{ n: '52', label: 'lolos ronde 1' },
				{ n: '30', label: 'setelah disaring' }
			]
		},
		share: {
			title: 'Minta pendapat tanpa mengirim file',
			body: 'Bagikan link dan PIN ke klien atau teman. Mereka menyortir sendiri di browser, lalu Anda melihat foto mana yang paling banyak dipilih dan memutuskan hasil akhirnya.',
			link: 'Link berbagi',
			pin: 'PIN',
			votes: 'suara',
			note: 'Tampilan contoh. Tamu hanya melihat salinan maksimal 800 KB.'
		},
		raw: {
			title: 'RAW dan JPG tetap berpasangan',
			body: 'File RAW dan JPG dengan nama sama dihitung satu foto dan selalu dipindah bersama. Pratinjau RAW memakai JPEG bawaan kamera, jadi tetap cepat.'
		}
	},
	alsoTitle: 'Juga',
	os: {
		ready: (os: string) => `Terdeteksi ${os}. Installer siap dipasang.`,
		meta: (v: string, size: string) => `Versi ${v}, ${size}`,
		requires: 'Pulahpilih berjalan di Windows 10 dan 11, 64-bit.',
		other: (os: string) => `Perangkat ini terdeteksi ${os}. Installer tidak akan berjalan di sini, tapi Anda tetap bisa mengunduhnya untuk dipindah ke PC Windows.`,
		mobile: (os: string) => `Perangkat ini terdeteksi ${os}. Pulahpilih adalah aplikasi PC, jadi buka halaman ini di PC Windows. Anda tetap bisa mengunduh installer sekarang.`,
		old: 'Windows versi ini terlalu lama. Installer butuh Windows 10 atau 11 dan kemungkinan gagal dipasang di sini, tapi tetap bisa diunduh.',
		bit32: 'Windows 32-bit terdeteksi. Installer hanya untuk Windows 64-bit dan tidak akan berjalan di sini, tapi tetap bisa diunduh.',
		anyway: 'Tetap unduh'
	},
	footer: {
		tagline: 'aplikasi sortir foto gratis untuk Windows.',
		licenses: 'Lisensi pihak ketiga',
		licenseBody: 'Membawa cloudflared (Apache 2.0) dan PhotoSwipe (MIT).',
		source: 'Kode sumber di GitHub'
	}
};

const en: typeof id = {
	langName: 'English',
	nav: { download: 'Download', usecases: 'Use cases', guides: 'Articles', compare: 'Compare', releases: 'Releases', help: 'Help', privacy: 'Privacy' },
	home: 'Home',
	meta: {
		title: 'Pulahpilih: free photo culling app for Windows',
		description:
			'Sort hundreds of photos down to your best. Compare three at a time, pick with the arrow keys, and repeat until you hit your target count.'
	},
	hero: {
		title: 'Sort hundreds of photos down to your best.',
		body: 'See three photos at once, press → to pick and ← to reject. Pulahpilih runs round after round until you have exactly as many as you need.',
		download: 'Download for Windows',
		soon: 'Coming soon',
		note: 'Free and open source for Windows 10 and 11',
		notes: 'Read the release notes'
	},
	demo: {
		label: 'Try it here',
		hint: 'Click this window, then use ← and →',
		folder: 'Graduation 2026',
		modes: { fill: 'Pick candidates', reduce: 'Narrow down', rescue: 'Add back from rejects' },
		ofTarget: (n) => `of target ${n}`,
		round: (n) => `Round ${n}`,
		reviewing: 'Reviewing',
		next: 'Next',
		pick: 'Pick',
		reject: 'Reject',
		done: (n) => `Done. ${n} photos picked.`,
		again: 'Run the demo again'
	},
	how: {
		title: 'How it works',
		steps: [
			{ title: 'Pick candidates', body: 'Every photo in the folder comes up once. The ones you pick move into a selected subfolder.' },
			{
				title: 'Narrow down',
				body: 'Still more than your target? The next round shows only your picks. Reject the weaker ones.'
			},
			{
				title: 'Add back from rejects',
				body: 'Came up short? The photos you rejected last round come back until the count is exact.'
			}
		]
	},
	features: {
		title: 'What you get',
		list: [
			{ title: 'RAW files included', body: 'CR2, CR3, NEF, ARW, DNG and more. RAW+JPG pairs with the same name move together.' },
			{ title: 'Zoom in to check detail', body: 'Click a photo or press Space. Scroll to zoom, swipe to move between photos.' },
			{ title: 'Get a second opinion', body: 'Share a link with a PIN. Friends sort in their browser; you approve the result.' },
			{ title: 'Undo a wrong key', body: 'Backspace reverses your last decision, including moving the file back.' },
			{ title: 'Photos stay on your PC', body: 'Nothing is uploaded. When sharing, guests see small copies of 800 KB at most.' },
			{ title: 'Pick up where you left off', body: 'Close the app mid-way. Open the same folder and it continues from the selected subfolder.' }
		]
	},
	downloadSection: {
		title: 'Download Pulahpilih',
		version: (v) => `Version ${v}`,
		released: 'Released',
		size: 'Size',
		requires: 'Windows 10 or 11, 64-bit',
		button: 'Download installer',
		none: 'The first version is on its way. Watch the releases page.',
		smartTitle: 'Seeing "Windows protected your PC"?',
		smartBody:
			"The installer isn't signed with a paid certificate yet, so SmartScreen shows a warning. Click \"More info\", then \"Run anyway\".",
		updates: 'Once installed, the app tells you when a new version is out.'
	},
	releases: {
		title: 'Release notes',
		lead: 'Every version of Pulahpilih, the photo culling app for Windows: new features, fixes, release dates and a download link for each.',
		latest: 'Latest',
		pre: 'Pre-release',
		download: 'Download',
		github: 'View on GitHub',
		empty: 'No releases yet. The first version is on its way.'
	},
	docs: {
		title: 'Help',
		lead: 'How to use Pulahpilih: start sorting, keyboard keys, where photos go, sharing with friends and keeping the app up to date.',
		faq: [
			{ q: 'How do I start?', a: 'Click Browse to choose a photo folder, set your target count, pick a sort order, then click Start sorting.' },
			{
				q: 'Which keys can I use?',
				a: '→ or ↑ to pick, ← or ↓ to reject, Backspace to undo, Space or Z to zoom. While zoomed, the arrows move between photos and Esc closes the viewer.'
			},
			{
				q: 'Where do picked photos go?',
				a: 'Into a selected subfolder inside the folder you chose. Rejected photos stay where they were. Nothing is ever deleted.'
			},
			{
				q: 'Why must the result match the target exactly?',
				a: "So you never count by hand. Too many and the app adds a narrowing round. Too few and last round's rejects come back."
			},
			{
				q: 'How do I ask friends to help?',
				a: 'Click Share in the toolbar. After about 25 seconds a link and PIN appear. Friends open the link, enter the PIN, sort on their own and send their picks. In the app, open Guest results to see the most-voted photos and approve the final set.'
			},
			{
				q: "The share link won't open?",
				a: 'Wait until the app shows the link; it only works once the tunnel is connected. If the same PC shows ERR_NAME_NOT_RESOLVED, run ipconfig /flushdns and try again.'
			},
			{
				q: 'Which formats are supported?',
				a: 'JPG, PNG, WebP and RAW: CR2, CR3, NEF, ARW, DNG, RAF, ORF, RW2, PEF, SRW. HEIC is not supported yet.'
			},
			{
				q: 'How do I update?',
				a: 'The app checks for a new version when it opens and offers an Update now button. You can also download the latest installer here.'
			}
		]
	},
	privacy: {
		title: 'Privacy',
		lead: "Pulahpilih runs on your PC. Your photos never reach our servers, because we don't have any.",
		points: [
			{ title: 'No account, no tracking', body: "The app doesn't send usage statistics or personal data." },
			{
				title: 'Update checks',
				body: 'When it opens, the app fetches latest.json from GitHub to check for a new version. The request carries no photo data.'
			},
			{
				title: 'When sharing',
				body: 'The app opens a temporary tunnel through Cloudflare. Guests with the link and PIN can see downsized copies of your photos (800 KB at most). Original files are never sent. Sharing ends when you click Stop sharing or close the app.'
			},
			{ title: 'This website', body: 'This site is static, with no cookies and no analytics.' }
		]
	},
	facts: {
		title: 'At a glance',
		price: 'Price',
		priceValue: 'Free, no ads, no account',
		license: 'License',
		licenseValue: 'Open source, GPL-3.0',
		system: 'System',
		systemValue: 'Windows 10 and 11, 64-bit',
		formats: 'Formats',
		language: 'Languages',
		languageValue: 'Indonesian and English',
		version: 'Latest version',
		maker: 'Made by'
	},
	usecaseSection: { title: 'Made for', more: 'All use cases' },
	hubs: {
		usecase: {
			title: 'Pulahpilih use cases',
			lead: 'Photo picking workflows for graduations, weddings, events and product shoots.'
		},
		guide: {
			title: 'Articles on picking and sorting photos',
			lead: 'How to pick your best photos, sort RAW files and get others to help you choose.'
		},
		compare: {
			title: 'Compare Pulahpilih',
			lead: 'Honest comparisons with other photo culling apps, including when another tool is the better fit.'
		}
	},
	doc: {
		updated: 'Updated',
		ctaTitle: 'Try Pulahpilih',
		ctaBody: 'Free and open source for Windows 10 and 11.',
		ctaButton: 'Download Pulahpilih',
		related: 'Read next'
	},
	notFound: { title: 'Page not found', body: 'The address may have a typo, or the page has moved.', home: 'Go to the home page' },
	split: {
		keys: {
			title: 'Three photos, one decision',
			body: 'The left photo is under review and the next two are already in view for comparison. No opening files one by one, and nothing is ever deleted: a wrong key is one undo away.',
			keys: [
				{ key: '→', label: 'Pick the photo' },
				{ key: '←', label: 'Reject the photo' },
				{ key: '⌫', label: 'Undo, the file moves back' },
				{ key: 'Space', label: 'Zoom in to check focus' }
			]
		},
		rounds: {
			title: 'Stops exactly at your target',
			body: 'Set the target once. Pulahpilih repeats rounds until the selected folder holds exactly that many photos, no more and no fewer.',
			example: 'Example run with a target of 30 photos',
			counts: [
				{ n: '240', label: 'photos in the folder' },
				{ n: '52', label: 'kept in round 1' },
				{ n: '30', label: 'after narrowing' }
			]
		},
		share: {
			title: 'Get opinions without sending files',
			body: 'Share a link and PIN with a client or friend. They sort on their own in the browser, then you see which photos got the most votes and make the final call.',
			link: 'Share link',
			pin: 'PIN',
			votes: 'votes',
			note: 'Example view. Guests only see copies of 800 KB at most.'
		},
		raw: {
			title: 'RAW and JPG stay together',
			body: 'RAW and JPG files with the same name count as one photo and always move together. RAW previews use the JPEG embedded by the camera, so they stay fast.'
		}
	},
	alsoTitle: 'Also',
	os: {
		ready: (os) => `Detected ${os}. The installer is ready to go.`,
		meta: (v, size) => `Version ${v}, ${size}`,
		requires: 'Pulahpilih runs on Windows 10 and 11, 64-bit.',
		other: (os) => `This device looks like ${os}. The installer won't run here, but you can still download it to move it to a Windows PC.`,
		mobile: (os) => `This device looks like ${os}. Pulahpilih is a desktop app, so open this page on a Windows PC. You can still download the installer now.`,
		old: 'This Windows version is too old. The installer needs Windows 10 or 11 and will probably fail here, but you can still download it.',
		bit32: "32-bit Windows detected. The installer is for 64-bit Windows only and won't run here, but you can still download it.",
		anyway: 'Download anyway'
	},
	footer: {
		tagline: 'free photo culling app for Windows.',
		licenses: 'Third-party licenses',
		licenseBody: 'Ships cloudflared (Apache 2.0) and PhotoSwipe (MIT).',
		source: 'Source code on GitHub'
	}
};

export const dict = { id, en };
