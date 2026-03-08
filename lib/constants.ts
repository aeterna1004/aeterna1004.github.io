export const MUSIC_TRACKS = [
    "/musics/bg-music-1.mp3",
    "/musics/bg-music-2.mp3",
    "/musics/bg-music-3.mp3",
    "/musics/bg-music-4.mp3",
]

export const MUSIC_VOLUME = 0.4

export const QUOTES = [
    "Anh không biết yêu là gì, chỉ biết rằng thiếu em là thiếu tất cả.",
    "Bên em, thời gian trở thành những cánh hoa không bao giờ tàn.",
    "Mỗi ngày bên em đều là một hạnh phúc nhỏ.",
    "Em là câu trả lời cho tất cả câu hỏi của trái tim anh.",
    "Không cần đi xa, chỉ cần được ở bên em.",
    "Yêu em là điều tuyệt vời nhất anh từng làm.",
    "Bên em, mỗi cơn mưa cũng trở nên lãng mạn.",
    "Anh muốn được là người bên em mỗi sáng thức dậy.",
]

export const ANNIVERSARY_QUOTES = [
    "Cảm ơn em đã biến những ngày bình thường thành hành trình đáng nhớ nhất của anh.",
    "Hạnh phúc không phải là đích đến, mà là mỗi ngày được cùng em già đi.",
    "Trong vạn người, cảm ơn em đã chọn dừng chân và xây dựng 'nhà' cùng anh.",
    "Mỗi năm trôi qua, anh lại nhận ra mình yêu em sâu đậm hơn một chút."
];

export const VALENTINE_QUOTES = [
    "Thế giới có 8 tỷ người, nhưng Valentine của anh chỉ gói gọn lại trong tên Em.",
    "Chẳng cần socola, nụ cười của em đã đủ làm ngày hôm nay của anh ngọt ngào rồi.",
    "Valentine này và nhiều năm sau nữa, vị trí bên cạnh anh vẫn chỉ dành riêng cho em.",
    "Hôm nay em cứ việc xinh đẹp, cả thế giới và cả anh, đều thuộc về em."
];

export const WOMEN_DAY_QUOTES = [
    "Chúc em luôn rạng rỡ như ánh mặt trời và dịu dàng như làn gió xuân.",
    "Đừng chỉ hạnh phúc ngày 8/3, hãy hứa với anh là sẽ yêu chiều bản thân mình mỗi ngày.",
    "Gửi đến người phụ nữ làm thay đổi định nghĩa về sự hoàn hảo trong anh: 8/3 rực rỡ nhé!",
    "Cảm ơn em đã đến và tô thêm những gam màu tuyệt vời nhất vào cuộc đời anh."
];

export const VN_WOMEN_DAY_QUOTES = [
    "Dành tặng sự trân trọng nhất cho người phụ nữ vừa là hậu phương, vừa là cả thế giới của anh.",
    "Chúc công chúa của anh ngày 20/10 ngập tràn quà cáp và tiếng cười.",
    "Thế giới gọi em là phụ nữ, còn anh gọi em là 'nhà'. Chúc em 20/10 bình yên.",
    "Chẳng cần là hoa hậu của ai, em luôn là người con gái đẹp nhất trong mắt anh."
];

export const BIRTHDAY_QUOTES = [
    "Chúc mừng sinh nhật nhé, niềm hạnh phúc của anh.",
    "Bên em, tuổi mới nào cũng thật rạng rỡ.",
    "Cảm ơn ngày này năm ấy, thế giới đã có một thiên thần.",
    "Hành trình tuổi mới, hãy để anh được đồng hành cùng em.",
]

export const PHOTO_DATA = [
    { src: "/photos/photo-1.jpg" },
    { src: "/photos/photo-2.jpg" },
    { src: "/photos/photo-3.jpg" },
    { src: "/photos/photo-4.jpg" },
    { src: "/photos/photo-5.jpg" },
    { src: "/photos/photo-6.jpg" },
    { src: "/photos/photo-7.jpg" },
    { src: "/photos/photo-8.jpg" },
    { src: "/photos/photo-9.jpg" },
    { src: "/photos/photo-10.jpg" },
    // { src: "/photos/photo-11.jpg" },
    // { src: "/photos/photo-12.jpg" },
]

export const GALLERY_TITLE = "Góc Kỷ Niệm"
export const GALLERY_SUBTITLE = "Những khoảnh khắc yêu thương"
export const GALLERY_BOTTOM_QUOTE = "Bởi vì điều tuyệt vời nhất không nằm ở nơi ta đến, mà là người đồng hành cùng ta trên ngần ấy chặng đường."

export const ANNIVERSARY_DATE = "2020-04-10T16:50:00+07:00"
// export const ANNIVERSARY_DATE = "2020-03-07T22:55:00+07:00"
export const ANNIVERSARY_DISPLAY_TEXT = "Từ 16:50 ngày 10/04/2020"

export const PARTNER_1_NAME = "Nhật Trường"
export const PARTNER_2_NAME = "Cẩm Thúy"

// === CELEBRATION EFFECTS CONFIG ===

export type CelebrationEffect = "romantic-fireworks" | "rose-fireworks"

export interface CelebrationRule {
    // Điều kiện kích hoạt: Hỗ trợ thời lượng duy trì (durationHours - mặc định 24h)
    trigger:
    | { type: "anniversary-year"; durationHours?: number }
    | { type: "anniversary-month"; durationHours?: number }
    | { type: "custom-date"; date: string; time?: string; durationHours?: number } // time format: "HH:mm"
    | { type: "test" } // Luôn luôn kích hoạt (dùng để test)
    effect: CelebrationEffect
    customSubtitle?: string                // Chữ hiển thị thay cho "Bên nhau được"
    customQuotes?: string[]                // Danh sách câu nói thay cho QUOTES mặc định
    highIntensityScreens?: string[]        // Các màn hình bắn "Nhanh" (chỉ diễn ra lúc vừa đúng giờ G)
    lowIntensityScreens?: string[]         // Các màn hình bắn "Chậm" (duy trì xuyên suốt thời gian durationHours)
    slowInterval?: {
        minMs: number;
        maxMs: number;
        burstCount?: {
            min: number;
            max: number;
            mobileMin?: number;
            mobileMax?: number;
            tabletMin?: number;
            tabletMax?: number;
        };
    } // Mức độ giãn cách tính bằng mili-giây khi sang hiệu ứng chậm
    fastPhase?: {
        durationMs: number;
        minMs: number;
        maxMs: number;
        maxItems?: number;
        mobileMaxItems?: number;
        tabletMaxItems?: number;
    } // Cấu hình màn "Mở màn" đại tiệc
    birthdayMaster?: { name: string; year: number } // Thông tin để tính số tuổi
}

export const CELEBRATION_RULES: CelebrationRule[] = [
    // Tròn năm kỷ niệm → romantic-fireworks 
    {
        trigger: { type: "anniversary-year", durationHours: 24 },
        effect: "romantic-fireworks",
        customSubtitle: "Ngày kỷ niệm hạnh phúc",
        customQuotes: ANNIVERSARY_QUOTES,
        highIntensityScreens: ["timer"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },

    // Valentine → romantic-fireworks
    {
        trigger: { type: "custom-date", date: "14/02", time: "00:00", durationHours: 24 },
        effect: "romantic-fireworks",
        customSubtitle: "Valentine ngọt ngào nhé",
        customQuotes: VALENTINE_QUOTES,
        highIntensityScreens: ["timer", "photos"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },

    // Quốc tế Phụ nữ 8/3 → rose-fireworks
    {
        trigger: { type: "custom-date", date: "08/03", time: "00:00", durationHours: 24 },
        effect: "rose-fireworks",
        customSubtitle: "Chúc mừng ngày Phụ nữ 8/3",
        customQuotes: WOMEN_DAY_QUOTES,
        highIntensityScreens: ["timer", "photos"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },

    // Phụ nữ Việt Nam 20/10 → rose-fireworks
    {
        trigger: { type: "custom-date", date: "20/10", time: "00:00", durationHours: 24 },
        effect: "rose-fireworks",
        customSubtitle: "Chúc mừng ngày Phụ nữ VN 20/10",
        customQuotes: VN_WOMEN_DAY_QUOTES,
        highIntensityScreens: ["timer", "photos"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },

    // Sinh nhật Cẩm Thúy 29/04
    {
        trigger: { type: "custom-date", date: "29/04", time: "00:00", durationHours: 24 },
        effect: "rose-fireworks",
        birthdayMaster: { name: "Cẩm Thúy", year: 2003 },
        customQuotes: BIRTHDAY_QUOTES,
        lowIntensityScreens: ["intro", "timer", "photos"],
        highIntensityScreens: ["timer"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },

    // Sinh nhật Nhật Trường 16/06
    {
        trigger: { type: "custom-date", date: "16/06", time: "00:00", durationHours: 24 },
        effect: "rose-fireworks",
        birthdayMaster: { name: "Nhật Trường", year: 2003 },
        customQuotes: QUOTES,
        lowIntensityScreens: ["intro", "timer", "photos"],
        highIntensityScreens: ["timer"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3, mobileMax: 2 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6, mobileMaxItems: 6 }
    },
]
