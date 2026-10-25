import { contact, type Locale } from "./site";

// Terms of service and privacy policy for usavstudio.com, including the Account Booster at /booster.
// Statements here describe what the site actually does (Discord login, stored fields, cookies), so keep them
// in step with src/lib/auth.ts and src/models when those change.

export type LegalSection = { heading: string; paragraphs?: string[]; items?: string[] };
export type LegalDocument = { title: string; intro: string; sections: LegalSection[] };
export type LegalKind = "terms" | "privacy";

export const legalUpdated = "22.10.2026";

const contactLine = {
  vi: `Email: ${contact.email} · Điện thoại: ${contact.phoneDisplay} · Đại diện: ${contact.representative}`,
  en: `Email: ${contact.email} · Phone: ${contact.phoneDisplay} · Representative: ${contact.representative}`,
};

const documents: Record<Locale, Record<LegalKind, LegalDocument>> = {
  vi: {
    terms: {
      title: "Điều khoản dịch vụ",
      intro:
        "Các điều khoản này áp dụng cho website usavstudio.com, bao gồm cửa hàng Account Booster tại usavstudio.com/booster, và các giải đấu do USAV Studio tổ chức. Khi sử dụng website hoặc dịch vụ của chúng tôi, bạn đồng ý với các điều khoản dưới đây.",
      sections: [
        {
          heading: "1. Về USAV Studio",
          paragraphs: [
            "USAV Studio là studio truyền thông gaming tại Hà Nội, Việt Nam, cung cấp dịch vụ tổ chức giải đấu, sản xuất livestream, nội dung và cửa hàng Account Booster cho tựa game Delta Force.",
            contactLine.vi,
          ],
        },
        {
          heading: "2. Tài khoản và đăng nhập Discord",
          items: [
            "Account Booster yêu cầu đăng nhập bằng Discord. Chúng tôi không tạo hay lưu mật khẩu cho bạn.",
            "Vai trò của bạn trên website (khách hàng, người mua, booster, quản trị) được xác định theo vai trò của bạn trong server Discord của USAV và có thể thay đổi khi vai trò đó thay đổi.",
            "Bạn chịu trách nhiệm bảo mật tài khoản Discord của mình và mọi hoạt động diễn ra dưới tài khoản đó.",
            "Chúng tôi có thể tạm khóa hoặc chấm dứt quyền truy cập của tài khoản vi phạm các điều khoản này.",
          ],
        },
        {
          heading: "3. Đơn hàng, giá và thanh toán",
          items: [
            "Giá áp dụng là giá hiển thị trong cửa hàng tại thời điểm đặt hàng.",
            "Thanh toán bằng chuyển khoản ngân hàng hoặc số dư đã nạp. Đơn hàng được xử lý sau khi thanh toán được xác nhận.",
            "Chúng tôi có thể từ chối hoặc hủy đơn hàng, ví dụ khi có sai sót về giá hoặc nghi ngờ gian lận. Khi đó, số tiền bạn đã thanh toán cho đơn hàng sẽ được hoàn lại.",
          ],
        },
        {
          heading: "4. Giao hàng và hoàn tiền",
          items: [
            "Tài khoản game và các sản phẩm số khác không được hoàn tiền sau khi đã giao.",
            "Nếu sản phẩm không đúng mô tả, vui lòng liên hệ chúng tôi trong vòng 24 giờ kể từ khi nhận để được hỗ trợ.",
            "Với dịch vụ cày thuê (boost) và coaching, phạm vi và thời gian thực hiện được thống nhất khi đơn hàng được phân công. Nếu không thể hoàn thành dịch vụ như đã thống nhất, chúng tôi hoàn lại phần chưa thực hiện.",
          ],
        },
        {
          heading: "5. Quy định của nhà phát hành game",
          paragraphs: [
            "Delta Force do nhà phát hành của trò chơi vận hành. Dịch vụ Account Booster do USAV Studio cung cấp, không phải do nhà phát hành. Việc mua tài khoản hoặc sử dụng dịch vụ cày thuê có thể trái với điều khoản của nhà phát hành và có thể dẫn đến việc tài khoản game bị hạn chế. Bạn hiểu và chấp nhận rủi ro này khi sử dụng các dịch vụ đó.",
          ],
        },
        {
          heading: "6. Giải đấu",
          items: [
            "Mỗi giải đấu có điều lệ riêng, được áp dụng cùng với các điều khoản này.",
            "Khi đăng ký thi đấu, đội tuyển đồng ý để USAV Studio phát sóng và công bố tên đội, tên trong game, hình ảnh, kết quả và số liệu thi đấu trên livestream, website và các kênh truyền thông của studio.",
          ],
        },
        {
          heading: "7. Hành vi bị cấm",
          items: [
            "Gian lận, lạm dụng thanh toán hoặc yêu cầu hoàn tiền không trung thực.",
            "Quấy rối khách hàng, booster hoặc đội ngũ của USAV Studio.",
            "Tấn công, dò quét hoặc làm gián đoạn website, hay truy cập trái phép vào dữ liệu của người khác.",
          ],
        },
        {
          heading: "8. Sở hữu trí tuệ",
          paragraphs: [
            "Nội dung, logo, thiết kế, video và hình ảnh trên website thuộc về USAV Studio hoặc đối tác. Tên và nhãn hiệu trò chơi thuộc về chủ sở hữu tương ứng. Bạn không được sao chép hoặc sử dụng cho mục đích thương mại khi chưa được cho phép.",
          ],
        },
        {
          heading: "9. Giới hạn trách nhiệm",
          paragraphs: [
            "Website và dịch vụ được cung cấp theo hiện trạng. Trong phạm vi pháp luật cho phép, USAV Studio không chịu trách nhiệm về các thiệt hại gián tiếp, và tổng trách nhiệm của chúng tôi đối với một đơn hàng không vượt quá số tiền bạn đã thanh toán cho đơn hàng đó.",
          ],
        },
        {
          heading: "10. Thay đổi điều khoản",
          paragraphs: [
            "Chúng tôi có thể cập nhật các điều khoản này. Ngày cập nhật được ghi ở đầu trang; các thay đổi quan trọng sẽ được thông báo trên website hoặc server Discord. Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc bạn chấp nhận điều khoản mới.",
          ],
        },
        {
          heading: "11. Luật áp dụng",
          paragraphs: [
            "Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp trước hết được giải quyết bằng thương lượng; nếu không thành, tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền của Việt Nam.",
          ],
        },
        { heading: "12. Liên hệ", paragraphs: [contactLine.vi] },
      ],
    },
    privacy: {
      title: "Chính sách quyền riêng tư",
      intro:
        "Chính sách này giải thích cách USAV Studio thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn trên usavstudio.com, bao gồm Account Booster, và trong các giải đấu do studio tổ chức.",
      sections: [
        {
          heading: "1. Dữ liệu chúng tôi thu thập",
          items: [
            "Từ Discord khi bạn đăng nhập: ID người dùng Discord, tên hiển thị, ảnh đại diện, địa chỉ email và danh sách vai trò của bạn trong server Discord của USAV. Chúng tôi không nhận được mật khẩu Discord của bạn.",
            "Đơn hàng và số dư: sản phẩm, số tiền, trạng thái đơn hàng, phương thức thanh toán và lịch sử nạp tiền.",
            "Thông tin bạn gửi để chúng tôi thực hiện đơn hàng, ví dụ tên trong game.",
            "Với booster: lịch ca làm việc trên lịch Account Booster.",
            "Với giải đấu: tên đội, tên trong game của thành viên, thông tin liên hệ khi đăng ký, kết quả và số liệu thi đấu.",
            "Dữ liệu kỹ thuật như địa chỉ IP và trình duyệt trong nhật ký máy chủ của nhà cung cấp hosting.",
          ],
        },
        {
          heading: "2. Mục đích sử dụng",
          items: [
            "Đăng nhập và phân quyền theo vai trò Discord của bạn.",
            "Xử lý, giao đơn hàng và hỗ trợ khách hàng.",
            "Phân công đơn hàng cho booster. Booster chỉ thấy tên, liên kết hồ sơ Discord và nội dung đơn hàng của bạn, không thấy email.",
            "Tổ chức, phát sóng và công bố kết quả giải đấu.",
            "Bảo mật, phòng chống gian lận và thực hiện nghĩa vụ theo quy định pháp luật.",
          ],
          paragraphs: ["Chúng tôi không bán dữ liệu cá nhân và không dùng dữ liệu của bạn cho quảng cáo."],
        },
        {
          heading: "3. Cookie và lưu trữ trên trình duyệt",
          items: [
            "Cookie phiên đăng nhập, được tạo khi bạn đăng nhập và giữ bạn đăng nhập tối đa 7 ngày.",
            "Lựa chọn giao diện sáng/tối, lưu trong trình duyệt của bạn.",
          ],
          paragraphs: ["Chúng tôi không dùng cookie quảng cáo hay cookie phân tích."],
        },
        {
          heading: "4. Chia sẻ dữ liệu",
          items: [
            "Discord, để xác thực đăng nhập và đọc vai trò của bạn trong server.",
            "Nhà cung cấp hạ tầng lưu trữ website và cơ sở dữ liệu, chỉ để vận hành dịch vụ.",
            "Ngân hàng, khi bạn thanh toán bằng chuyển khoản.",
            "Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.",
          ],
          paragraphs: ["Kết quả giải đấu, tên đội và tên trong game được công bố công khai."],
        },
        {
          heading: "5. Thời gian lưu trữ",
          paragraphs: [
            "Dữ liệu tài khoản được lưu trong thời gian tài khoản còn hoạt động. Hồ sơ đơn hàng được lưu trong thời gian pháp luật về kế toán và thuế yêu cầu. Bạn có thể yêu cầu xóa dữ liệu bất kỳ lúc nào; dữ liệu mà pháp luật buộc phải lưu sẽ được giữ đến hết thời hạn đó.",
          ],
        },
        {
          heading: "6. Bảo mật",
          paragraphs: [
            "Website sử dụng kết nối mã hóa HTTPS, và quyền truy cập dữ liệu được giới hạn theo vai trò. Không có hệ thống nào an toàn tuyệt đối, nhưng chúng tôi sẽ thông báo cho bạn và xử lý kịp thời nếu xảy ra sự cố ảnh hưởng đến dữ liệu của bạn.",
          ],
        },
        {
          heading: "7. Quyền của bạn",
          items: [
            "Được biết, truy cập và nhận bản sao dữ liệu cá nhân của mình.",
            "Yêu cầu chỉnh sửa hoặc xóa dữ liệu.",
            "Rút lại sự đồng ý hoặc phản đối việc xử lý dữ liệu.",
            "Thu hồi quyền truy cập của USAV Studio trong Discord tại Cài đặt người dùng → Ứng dụng đã cấp quyền.",
          ],
          paragraphs: [
            "Các quyền này được thực hiện theo quy định của pháp luật Việt Nam về bảo vệ dữ liệu cá nhân. Gửi yêu cầu qua email bên dưới.",
          ],
        },
        {
          heading: "8. Người dùng dưới 16 tuổi",
          paragraphs: ["Nếu bạn dưới 16 tuổi, vui lòng chỉ sử dụng dịch vụ khi có sự đồng ý của cha mẹ hoặc người giám hộ."],
        },
        {
          heading: "9. Thay đổi chính sách",
          paragraphs: [
            "Chúng tôi có thể cập nhật chính sách này. Ngày cập nhật được ghi ở đầu trang; các thay đổi quan trọng sẽ được thông báo trên website hoặc server Discord.",
          ],
        },
        { heading: "10. Liên hệ", paragraphs: [contactLine.vi] },
      ],
    },
  },
  en: {
    terms: {
      title: "Terms of Service",
      intro:
        "These terms apply to usavstudio.com, including the Account Booster store at usavstudio.com/booster, and to tournaments organized by USAV Studio. By using the website or our services, you agree to them.",
      sections: [
        {
          heading: "1. About USAV Studio",
          paragraphs: [
            "USAV Studio is a gaming media studio in Hanoi, Vietnam. We organize tournaments, produce livestreams and content, and run the Account Booster store for Delta Force.",
            contactLine.en,
          ],
        },
        {
          heading: "2. Accounts and Discord login",
          items: [
            "Account Booster requires signing in with Discord. We do not create or store a password for you.",
            "Your role on the website (customer, buyer, booster, admin) comes from your roles in the USAV Discord server and may change when those roles change.",
            "You are responsible for keeping your Discord account secure and for all activity under it.",
            "We may suspend or end access for accounts that break these terms.",
          ],
        },
        {
          heading: "3. Orders, prices and payment",
          items: [
            "The price that applies is the one shown in the store when you place the order.",
            "Payment is by bank transfer or account balance. Orders are processed once payment is confirmed.",
            "We may refuse or cancel an order, for example after a pricing error or suspected fraud. In that case, any amount you paid for the order is refunded.",
          ],
        },
        {
          heading: "4. Delivery and refunds",
          items: [
            "Game accounts and other digital products are non-refundable once delivered.",
            "If a product does not match its description, contact us within 24 hours of delivery and we will help.",
            "For boosting and coaching, the scope and timeframe are agreed when the order is assigned. If we cannot complete the service as agreed, we refund the part not delivered.",
          ],
        },
        {
          heading: "5. Game publisher rules",
          paragraphs: [
            "Delta Force is operated by its publisher. Account Booster services are provided by USAV Studio, not by the publisher. Buying accounts or using boosting may go against the publisher's terms and can lead to restrictions on a game account. You understand and accept this risk when using those services.",
          ],
        },
        {
          heading: "6. Tournaments",
          items: [
            "Each tournament has its own rulebook, which applies together with these terms.",
            "By registering, teams agree that USAV Studio may broadcast and publish team names, in-game names, images, results and match statistics on its livestreams, website and channels.",
          ],
        },
        {
          heading: "7. Prohibited conduct",
          items: [
            "Fraud, payment abuse or dishonest refund requests.",
            "Harassing customers, boosters or USAV Studio staff.",
            "Attacking, scanning or disrupting the website, or accessing other people's data without permission.",
          ],
        },
        {
          heading: "8. Intellectual property",
          paragraphs: [
            "Content, logos, designs, videos and images on the website belong to USAV Studio or its partners. Game names and trademarks belong to their owners. You may not copy them or use them commercially without permission.",
          ],
        },
        {
          heading: "9. Limitation of liability",
          paragraphs: [
            "The website and services are provided as is. To the extent the law allows, USAV Studio is not liable for indirect losses, and our total liability for an order is limited to the amount you paid for it.",
          ],
        },
        {
          heading: "10. Changes to these terms",
          paragraphs: [
            "We may update these terms. The date at the top of this page shows the latest version, and significant changes are announced on the website or the Discord server. Continuing to use our services after an update means you accept the new terms.",
          ],
        },
        {
          heading: "11. Governing law",
          paragraphs: [
            "These terms are governed by the laws of Vietnam. Disputes are first resolved by negotiation; if that fails, they go to the competent courts of Vietnam.",
          ],
        },
        { heading: "12. Contact", paragraphs: [contactLine.en] },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy explains how USAV Studio collects, uses and protects your personal data on usavstudio.com, including Account Booster, and in the tournaments the studio organizes.",
      sections: [
        {
          heading: "1. Data we collect",
          items: [
            "From Discord when you sign in: your Discord user ID, display name, avatar, email address and your list of roles in the USAV Discord server. We never receive your Discord password.",
            "Orders and balance: products, amounts, order status, payment method and top-up history.",
            "Information you send us to fulfil an order, such as your in-game name.",
            "For boosters: the shifts you add to the Account Booster calendar.",
            "For tournaments: team name, players' in-game names, contact details given at registration, results and match statistics.",
            "Technical data such as IP address and browser, in our hosting provider's server logs.",
          ],
        },
        {
          heading: "2. How we use it",
          items: [
            "To sign you in and give you permissions based on your Discord roles.",
            "To process and deliver orders and to support you.",
            "To assign orders to boosters. A booster sees only your name, a link to your Discord profile and the order contents, never your email.",
            "To run, broadcast and publish tournament results.",
            "For security, fraud prevention and legal obligations.",
          ],
          paragraphs: ["We do not sell personal data and do not use it for advertising."],
        },
        {
          heading: "3. Cookies and browser storage",
          items: [
            "A session cookie, set when you sign in, keeps you signed in for up to 7 days.",
            "Your light/dark theme choice, saved in your browser.",
          ],
          paragraphs: ["We do not use advertising or analytics cookies."],
        },
        {
          heading: "4. Who we share it with",
          items: [
            "Discord, to verify your sign-in and read your server roles.",
            "The providers that host the website and database, only to run the service.",
            "Your bank, when you pay by bank transfer.",
            "Competent authorities, when the law requires it.",
          ],
          paragraphs: ["Tournament results, team names and in-game names are published publicly."],
        },
        {
          heading: "5. How long we keep it",
          paragraphs: [
            "Account data is kept while your account is active. Order records are kept for as long as accounting and tax law require. You can ask us to delete your data at any time; data the law requires us to keep is held until that period ends.",
          ],
        },
        {
          heading: "6. Security",
          paragraphs: [
            "The website uses encrypted HTTPS connections, and access to data is limited by role. No system is perfectly secure, but if an incident affects your data we will tell you and act promptly.",
          ],
        },
        {
          heading: "7. Your rights",
          items: [
            "To know about, access and get a copy of your personal data.",
            "To have your data corrected or deleted.",
            "To withdraw consent or object to processing.",
            "To revoke USAV Studio's access in Discord under User Settings → Authorized Apps.",
          ],
          paragraphs: [
            "These rights apply under Vietnamese personal data protection law. Send requests to the email below.",
          ],
        },
        {
          heading: "8. Users under 16",
          paragraphs: ["If you are under 16, please use our services only with a parent's or guardian's permission."],
        },
        {
          heading: "9. Changes to this policy",
          paragraphs: [
            "We may update this policy. The date at the top of this page shows the latest version, and significant changes are announced on the website or the Discord server.",
          ],
        },
        { heading: "10. Contact", paragraphs: [contactLine.en] },
      ],
    },
  },
};

export function getLegal(lang: Locale, kind: LegalKind): LegalDocument {
  return documents[lang][kind];
}
