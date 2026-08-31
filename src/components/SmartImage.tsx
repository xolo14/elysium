import { cn } from "@/lib/utils";

type SmartImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  priority?: boolean;
};

function webpSrc(src: string) {
  if (!/\.(png|jpe?g)$/i.test(src)) return null;
  if (src.startsWith("data:") || src.startsWith("blob:")) return null;
  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}

/** Prefer WebP when generated beside the source; PNG/JPEG remains the fallback. */
export function SmartImage({
  src,
  alt,
  className,
  priority = false,
  decoding = "async",
  ...rest
}: SmartImageProps) {
  const webp = webpSrc(src);
  const imgProps = {
    alt,
    className,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding,
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto" | "low",
    ...rest,
  };

  if (!webp) {
    return <img src={src} {...imgProps} />;
  }

  return (
    <picture className={cn(className && "contents")}>
      <source srcSet={webp} type="image/webp" />
      <img src={src} {...imgProps} />
    </picture>
  );
}
