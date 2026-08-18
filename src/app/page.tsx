"use client";

import {
  Check,
  Clock3,
  Copy,
  Download,
  Github,
  History,
  Languages,
  Loader2,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { normalizeMagnetInput } from "@/lib/magnet";

const HISTORY_STORAGE_KEY = "magnet2torrent.history.v1";
const LANGUAGE_STORAGE_KEY = "magnet2torrent.language";
const CLIENT_TIMEOUT_MS = 35_000;
const MAX_HISTORY_ITEMS = 8;

const translations = {
  en: {
    languageName: "English",
    languageMenu: "Language",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    sourceCode: "View source code",
    description: "Paste a magnet link to instantly generate a .torrent file.",
    inputLabel: "Magnet link or info hash",
    inputPlaceholder: "magnet:?xt=urn:btih:... or info hash",
    convert: "Convert & download",
    converting: "Fetching metadata...",
    timeoutNote: "This can take up to 30 seconds.",
    historyTitle: "History",
    clearHistory: "Clear history",
    historyEmpty: "No conversion history yet",
    downloaded: "Downloaded",
    copyMagnet: "Copy magnet input",
    copiedTitle: "Copied",
    copiedDescription: "The magnet input is in your clipboard.",
    successTitle: "Conversion successful",
    successDescription: "The torrent is ready and your download has started.",
    invalidTitle: "Invalid magnet link",
    invalidDescription: "Enter a complete BTIH magnet link or a valid info hash.",
    timeoutTitle: "Conversion timed out",
    timeoutDescription: "No metadata was found within 30 seconds. Try again later.",
    failedTitle: "Conversion failed",
    failedDescription: "The torrent metadata could not be retrieved.",
  },
  "zh-CN": {
    languageName: "简体中文",
    languageMenu: "语言",
    themeToDark: "切换到深色模式",
    themeToLight: "切换到浅色模式",
    sourceCode: "查看源代码",
    description: "粘贴磁力链接，即刻生成 .torrent 文件。",
    inputLabel: "磁力链接或 Info Hash",
    inputPlaceholder: "magnet:?xt=urn:btih:... 或 Info Hash",
    convert: "转换并下载",
    converting: "正在获取元数据...",
    timeoutNote: "最长需要 30 秒。",
    historyTitle: "历史记录",
    clearHistory: "清空历史记录",
    historyEmpty: "暂无转换记录",
    downloaded: "已下载",
    copyMagnet: "复制磁力输入",
    copiedTitle: "已复制",
    copiedDescription: "磁力输入已复制到剪贴板。",
    successTitle: "转换成功",
    successDescription: "种子文件已生成并开始下载。",
    invalidTitle: "磁力链接无效",
    invalidDescription: "请输入完整的 BTIH 磁力链接或有效的 Info Hash。",
    timeoutTitle: "转换超时",
    timeoutDescription: "30 秒内未获取到元数据，请稍后重试。",
    failedTitle: "转换失败",
    failedDescription: "无法获取种子元数据。",
  },
  "zh-TW": {
    languageName: "繁體中文",
    languageMenu: "語言",
    themeToDark: "切換至深色模式",
    themeToLight: "切換至淺色模式",
    sourceCode: "檢視原始碼",
    description: "貼上磁力連結，即刻產生 .torrent 檔案。",
    inputLabel: "磁力連結或 Info Hash",
    inputPlaceholder: "magnet:?xt=urn:btih:... 或 Info Hash",
    convert: "轉換並下載",
    converting: "正在取得中繼資料...",
    timeoutNote: "最長需要 30 秒。",
    historyTitle: "歷史記錄",
    clearHistory: "清除歷史記錄",
    historyEmpty: "暫無轉換記錄",
    downloaded: "已下載",
    copyMagnet: "複製磁力輸入",
    copiedTitle: "已複製",
    copiedDescription: "磁力輸入已複製到剪貼簿。",
    successTitle: "轉換成功",
    successDescription: "種子檔案已產生並開始下載。",
    invalidTitle: "磁力連結無效",
    invalidDescription: "請輸入完整的 BTIH 磁力連結或有效的 Info Hash。",
    timeoutTitle: "轉換逾時",
    timeoutDescription: "30 秒內未取得中繼資料，請稍後再試。",
    failedTitle: "轉換失敗",
    failedDescription: "無法取得種子中繼資料。",
  },
  ja: {
    languageName: "日本語",
    languageMenu: "言語",
    themeToDark: "ダークモードに切り替え",
    themeToLight: "ライトモードに切り替え",
    sourceCode: "ソースコードを見る",
    description: "マグネットリンクを貼り付けて .torrent ファイルを生成します。",
    inputLabel: "マグネットリンクまたは Info Hash",
    inputPlaceholder: "magnet:?xt=urn:btih:... または Info Hash",
    convert: "変換してダウンロード",
    converting: "メタデータを取得中...",
    timeoutNote: "最大 30 秒かかります。",
    historyTitle: "履歴",
    clearHistory: "履歴を消去",
    historyEmpty: "変換履歴はありません",
    downloaded: "ダウンロード済み",
    copyMagnet: "入力をコピー",
    copiedTitle: "コピーしました",
    copiedDescription: "マグネット入力をクリップボードにコピーしました。",
    successTitle: "変換に成功しました",
    successDescription: "トレントの準備が完了し、ダウンロードを開始しました。",
    invalidTitle: "無効なマグネットリンク",
    invalidDescription: "完全な BTIH マグネットリンクまたは有効な Info Hash を入力してください。",
    timeoutTitle: "変換がタイムアウトしました",
    timeoutDescription: "30 秒以内にメタデータが見つかりませんでした。",
    failedTitle: "変換に失敗しました",
    failedDescription: "トレントのメタデータを取得できませんでした。",
  },
} as const;

type Locale = keyof typeof translations;

type HistoryEntry = {
  createdAt: number;
  fileName: string;
  id: string;
  infoHash: string;
  input: string;
};

type ConversionErrorCode = "invalid_input" | "timeout" | "conversion_failed";

const localeOptions: Locale[] = ["en", "zh-CN", "zh-TW", "ja"];

function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const language of languages) {
    const normalized = language.toLowerCase();
    if (normalized.startsWith("ja")) return "ja";
    if (
      normalized.includes("hant") ||
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") ||
      normalized.startsWith("zh-mo")
    ) {
      return "zh-TW";
    }
    if (normalized.startsWith("zh")) return "zh-CN";
  }

  return "en";
}

function isLocale(value: string | null): value is Locale {
  return localeOptions.includes(value as Locale);
}

function readHistory(): HistoryEntry[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");

    if (!Array.isArray(value)) return [];

    return value
      .filter(
        (item): item is HistoryEntry =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.input === "string" &&
          typeof item.infoHash === "string" &&
          typeof item.fileName === "string" &&
          typeof item.createdAt === "number",
      )
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

function decodeFileName(value: string | null) {
  if (!value) return "download.torrent";
  try {
    return decodeURIComponent(value);
  } catch {
    return "download.torrent";
  }
}

function triggerDownload(blob: Blob, fileName: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1_000);
}

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [locale, setLocale] = useState<Locale>("en");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = translations[locale];
  const isDark = isMounted && resolvedTheme === "dark";

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initialLocale = isLocale(storedLocale) ? storedLocale : detectBrowserLocale();

    document.documentElement.lang = initialLocale;
    const frame = window.requestAnimationFrame(() => {
      setLocale(initialLocale);
      setHistory(readHistory());
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  }

  function saveHistory(entry: HistoryEntry) {
    setHistory((current) => {
      const next = [entry, ...current.filter((item) => item.infoHash !== entry.infoHash)].slice(
        0,
        MAX_HISTORY_ITEMS,
      );
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  async function copyHistoryInput(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success(t.copiedTitle, {
      description: t.copiedDescription,
      duration: 3_500,
    });
  }

  function showConversionError(code: ConversionErrorCode) {
    const error =
      code === "invalid_input"
        ? [t.invalidTitle, t.invalidDescription]
        : code === "timeout"
          ? [t.timeoutTitle, t.timeoutDescription]
          : [t.failedTitle, t.failedDescription];

    toast.error(error[0], { description: error[1], duration: 5_000 });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const normalized = normalizeMagnetInput(input);
    if (!normalized.success) {
      setInputError(true);
      showConversionError("invalid_input");
      return;
    }

    setInputError(false);
    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ magnet: normalized.value.magnet }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          code?: ConversionErrorCode;
        } | null;
        showConversionError(payload?.code || "conversion_failed");
        return;
      }

      const fileName = decodeFileName(response.headers.get("X-Torrent-Name"));
      const infoHash = response.headers.get("X-Info-Hash") || normalized.value.infoHash;
      const torrentFile = await response.blob();
      triggerDownload(torrentFile, fileName);
      saveHistory({
        createdAt: Date.now(),
        fileName,
        id: crypto.randomUUID(),
        infoHash,
        input: input.trim(),
      });
      setInput("");
      toast.success(t.successTitle, {
        description: t.successDescription,
        duration: 4_500,
      });
    } catch (error) {
      showConversionError(
        error instanceof DOMException && error.name === "AbortError"
          ? "timeout"
          : "conversion_failed",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  const dateLocale = locale === "zh-CN" ? "zh-CN" : locale === "zh-TW" ? "zh-TW" : locale;

  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-end px-4 sm:px-6">
        <nav className="flex items-center gap-1" aria-label="Preferences and source code">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t.languageMenu}
                title={t.languageMenu}
              >
                <Languages aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t.languageMenu}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={locale}
                onValueChange={(value) => changeLocale(value as Locale)}
              >
                {localeOptions.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {translations[option].languageName}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? t.themeToLight : t.themeToDark}
            title={isDark ? t.themeToLight : t.themeToDark}
          >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/ZhanZiyuan/Magnet2Torrent-web"
              target="_blank"
              rel="noreferrer"
              aria-label={t.sourceCode}
              title={t.sourceCode}
            >
              <Github aria-hidden="true" />
            </a>
          </Button>
        </nav>
      </header>

      <main className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center px-4 py-8 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)]">
          <Card className="border-primary/10 bg-card/90 shadow-lg backdrop-blur-sm">
            <CardHeader className="items-center p-6 text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">
                <h1>Magnet to Torrent</h1>
              </CardTitle>
              <CardDescription className="pt-1">{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="magnet-input">
                    {t.inputLabel}
                  </label>
                  <Input
                    id="magnet-input"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      if (inputError) setInputError(false);
                    }}
                    placeholder={t.inputPlaceholder}
                    disabled={isSubmitting}
                    aria-invalid={inputError}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-12 font-mono text-sm"
                  />
                </div>

                <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Download aria-hidden="true" />
                  )}
                  {isSubmitting ? t.converting : t.convert}
                </Button>

                {isSubmitting && (
                  <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                    <Clock3 className="size-4" aria-hidden="true" />
                    {t.timeoutNote}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="min-h-80 border-primary/10 bg-card/90 shadow-lg backdrop-blur-sm lg:min-h-[26rem]">
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <History className="size-5 text-primary" aria-hidden="true" />
                {t.historyTitle}
              </CardTitle>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={clearHistory}
                  aria-label={t.clearHistory}
                  title={t.clearHistory}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {history.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground lg:min-h-72">
                  <History className="size-10 opacity-45" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm">{t.historyEmpty}</p>
                </div>
              ) : (
                <ol className="space-y-3">
                  {history.map((entry) => (
                    <li key={entry.id} className="rounded-lg border bg-background/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Check className="size-3.5" aria-hidden="true" />
                            {t.downloaded}
                          </span>
                          <p className="mt-1 truncate text-sm font-medium" title={entry.fileName}>
                            {entry.fileName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => void copyHistoryInput(entry.input)}
                          aria-label={t.copyMagnet}
                          title={t.copyMagnet}
                        >
                          <Copy aria-hidden="true" />
                        </Button>
                      </div>
                      <p
                        className="mt-2 truncate font-mono text-[11px] text-muted-foreground"
                        title={entry.input}
                      >
                        {entry.input}
                      </p>
                      <time
                        className="mt-2 block text-[10px] text-muted-foreground"
                        dateTime={new Date(entry.createdAt).toISOString()}
                      >
                        {new Intl.DateTimeFormat(dateLocale, {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(entry.createdAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
