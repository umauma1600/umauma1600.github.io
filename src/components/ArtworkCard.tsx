import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./ArtworkCard.css";

interface ArtworkCardBaseProps {
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  /** ジャンルバッジ（例: 謎解き） */
  genre?: string;
  /** 難易度バッジ（例: 初心者向け） */
  difficulty?: string;
  /** 難易度の星表記（例: ★☆☆☆☆） */
  stars?: string;
  /** 所要時間（例: 約10分） */
  duration?: string;
  /** サムネイルを少し高く表示する（トップページ用） */
  tall?: boolean;
}

// サイト内ページへは `to`、外部サイトへは `href` を指定する
type ArtworkCardProps = ArtworkCardBaseProps &
  ({ to: string; href?: never } | { href: string; to?: never });

export default function ArtworkCard(props: ArtworkCardProps) {
  const {
    title,
    description,
    image,
    ctaLabel,
    genre,
    difficulty,
    stars,
    duration,
    tall,
  } = props;
  const isExternal = props.href !== undefined;
  const className = `artwork-card group${tall ? " artwork-card-tall" : ""}`;

  const content = (
    <div className="artwork-frame">
      <div className="artwork-shine" />
      <div className="artwork-image">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="sparkles">
          <span className="sparkle sparkle-1">✦</span>
          <span className="sparkle sparkle-2">✧</span>
          <span className="sparkle sparkle-3">✦</span>
        </div>
      </div>
      <div className="artwork-content">
        {(genre ?? difficulty) && (
          <div className="flex items-center gap-2 mb-2">
            {genre && <span className="genre-badge">{genre}</span>}
            {difficulty && (
              <span className="difficulty-badge">{difficulty}</span>
            )}
          </div>
        )}
        <h3 className="artwork-title">{title}</h3>
        <p className="artwork-description">{description}</p>
        {(stars ?? duration) && (
          <div className="artwork-meta">
            {stars && (
              <span className="meta-item">
                <svg
                  className="meta-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {stars}
              </span>
            )}
            {duration && (
              <span className="meta-item">
                <svg
                  className="meta-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {duration}
              </span>
            )}
          </div>
        )}
        <div className="artwork-cta">
          <span className="cta-text">{ctaLabel}</span>
          <svg
            className="cta-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isExternal
                  ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  : "M17 8l4 4m0 0l-4 4m4-4H3"
              }
            />
          </svg>
        </div>
      </div>
    </div>
  );

  if (props.href !== undefined) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={props.to} className={className}>
      {content}
    </Link>
  );
}

interface ComingSoonCardProps {
  title: string;
  /** 中央に表示するアイコン（48px のSVGを想定） */
  icon: ReactNode;
}

export function ComingSoonCard({ title, icon }: ComingSoonCardProps) {
  return (
    <div className="artwork-card artwork-card-coming-soon">
      <div className="artwork-frame">
        <div className="artwork-image coming-soon-image">
          <div className="coming-soon-content">
            {icon}
            <span className="coming-soon-text">Coming Soon...</span>
          </div>
        </div>
        <div className="artwork-content coming-soon-info">
          <h3 className="artwork-title" style={{ opacity: 0.5 }}>
            {title}
          </h3>
          <p className="artwork-description" style={{ opacity: 0.4 }}>
            新しい作品を準備中です。お楽しみに！
          </p>
        </div>
      </div>
    </div>
  );
}
