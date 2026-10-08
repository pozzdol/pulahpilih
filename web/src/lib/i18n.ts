export const langs = ['id', 'en'] as const;
export type Lang = (typeof langs)[number];

const id = {
	langName: 'Bahasa Indonesia',
	nav: { download: 'Unduh', releases: 'Rilis', docs: 'Panduan', privacy: 'Privasi' },
	meta: {
		title: 'Photo Sorter untuk Windows',
		description:
			'Sortir ratusan foto sampai tersisa yang terbaik. Bandingkan tiga foto sekaligus, pilih dengan tombol panah, dan ulangi sampai jumlahnya pas dengan target.'
	},
	hero: {
		title: 'Sortir ratusan foto sampai tersisa yang terbaik.',
		body: 'Lihat tiga foto sekaligus, tekan → untuk memilih dan ← untuk menolak. Photo Sorter mengulang putaran sampai jumlah foto pas dengan target Anda.',
		download: 'Unduh untuk Windows',
		soon: 'Segera tersedia',
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
		title: 'Unduh Photo Sorter',
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
		lead: 'Semua versi Photo Sorter dan perubahannya.',
		latest: 'Terbaru',
		pre: 'Pra-rilis',
		download: 'Unduh',
		github: 'Lihat di GitHub',
		empty: 'Belum ada rilis. Versi pertama sedang disiapkan.'
	},
	docs: {
		title: 'Panduan',
		lead: 'Jawaban singkat untuk pertanyaan yang paling sering muncul.',
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
		lead: 'Photo Sorter bekerja di PC Anda. Foto tidak dikirim ke server kami, karena kami tidak punya server.',
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
	footer: {
		licenses: 'Lisensi pihak ketiga',
		licenseBody: 'Membawa cloudflared (Apache 2.0) dan PhotoSwipe (MIT).',
		source: 'Kode sumber di GitHub'
	}
};

const en: typeof id = {
	langName: 'English',
	nav: { download: 'Download', releases: 'Releases', docs: 'Guide', privacy: 'Privacy' },
	meta: {
		title: 'Photo Sorter for Windows',
		description:
			'Sort hundreds of photos down to your best. Compare three at a time, pick with the arrow keys, and repeat until you hit your target count.'
	},
	hero: {
		title: 'Sort hundreds of photos down to your best.',
		body: 'See three photos at once, press → to pick and ← to reject. Photo Sorter runs round after round until you have exactly as many as you need.',
		download: 'Download for Windows',
		soon: 'Coming soon',
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
		title: 'Download Photo Sorter',
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
		lead: 'Every Photo Sorter version and what changed.',
		latest: 'Latest',
		pre: 'Pre-release',
		download: 'Download',
		github: 'View on GitHub',
		empty: 'No releases yet. The first version is on its way.'
	},
	docs: {
		title: 'Guide',
		lead: 'Short answers to the questions that come up most.',
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
		lead: "Photo Sorter runs on your PC. Your photos never reach our servers, because we don't have any.",
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
	footer: {
		licenses: 'Third-party licenses',
		licenseBody: 'Ships cloudflared (Apache 2.0) and PhotoSwipe (MIT).',
		source: 'Source code on GitHub'
	}
};

export const dict = { id, en };
