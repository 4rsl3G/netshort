export default function LazyImage({ src, alt, className }) {
  return (
    <img
      loading="lazy"
      decoding="async"
      src={src}
      alt={alt}
      className={className}
      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/540x720?text=PANSA"; }}
    />
  );
}