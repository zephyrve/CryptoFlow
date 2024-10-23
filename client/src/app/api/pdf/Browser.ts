const CHROMIUM_PATH =
    "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
export const dynamic = "force-dynamic";

export const Browser = async () => {
    if (process.env.VERCEL_ENV === "production") {
        const chromium = await import("@sparticuz/chromium-min").then(
            (mod) => mod.default
        );
        const puppeteerCore = await import("puppeteer-core").then(
            (mod) => mod.default
        );

        const executablePath = await chromium.executablePath(CHROMIUM_PATH);
        const browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: chromium.headless,
        });
        return browser;
    } else {
        const puppeteer = await import("puppeteer").then((mod) => mod.default);
        return puppeteer.launch();
    }
};