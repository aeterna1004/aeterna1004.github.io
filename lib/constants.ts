export const MUSIC_TRACKS = [
    "/musics/bg-music-1.mp3",
    "/musics/bg-music-2.mp3",
    "/musics/bg-music-3.mp3",
    "/musics/bg-music-4.mp3",
]

export const MUSIC_VOLUME = 0.15

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

export type CelebrationEffect = "romantic-fireworks"

export interface CelebrationRule {
    // Điều kiện kích hoạt: Hỗ trợ thời lượng duy trì (durationHours - mặc định 24h)
    trigger:
    | { type: "anniversary-year"; durationHours?: number }
    | { type: "anniversary-month"; durationHours?: number }
    | { type: "custom-date"; date: string; time?: string; durationHours?: number } // time format: "HH:mm"
    | { type: "test" } // Luôn luôn kích hoạt (dùng để test)
    effect: CelebrationEffect
    highIntensityScreens?: string[]        // Các màn hình bắn "Nhanh" (chỉ diễn ra lúc vừa đúng giờ G)
    lowIntensityScreens?: string[]         // Các màn hình bắn "Chậm" (duy trì xuyên suốt thời gian durationHours)
    slowInterval?: {
        minMs: number;
        maxMs: number;
        burstCount?: { min: number; max: number };
    } // Mức độ giãn cách tính bằng mili-giây khi sang hiệu ứng chậm
    fastPhase?: { durationMs: number; minMs: number; maxMs: number; maxItems?: number } // Cấu hình màn "Mở màn" đại tiệc
}

export const CELEBRATION_RULES: CelebrationRule[] = [
    // Tròn năm kỷ niệm → romantic-fireworks 
    {
        trigger: { type: "anniversary-year", durationHours: 24 },
        effect: "romantic-fireworks",
        highIntensityScreens: ["timer"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6 }
    },

    // Valentine → romantic-fireworks
    {
        trigger: { type: "custom-date", date: "14/02", time: "00:00", durationHours: 24 },
        effect: "romantic-fireworks",
        highIntensityScreens: ["timer", "photos"],
        lowIntensityScreens: ["intro", "timer", "photos"],
        slowInterval: {
            minMs: 10000,
            maxMs: 15000,
            burstCount: { min: 1, max: 3 }
        },
        fastPhase: { durationMs: 20000, minMs: 400, maxMs: 1000, maxItems: 6 }
    },
]
