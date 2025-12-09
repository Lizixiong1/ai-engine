"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf-root" aria-labelledby="nf-title">
      <div className="nf-card">
        <div className="nf-content">
          <h1 id="nf-title" className="nf-code">
            404
          </h1>
          <h2 className="nf-heading">页面未找到</h2>
          <p className="nf-desc">
            抱歉，你访问的页面不存在或已被移动。你可以返回首页继续浏览，或联系我们获取帮助。
          </p>

          <div className="nf-actions"></div>
        </div>
      </div>

      <style jsx>{`
        .nf-root {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            180deg,
            rgba(99, 102, 241, 0.04),
            rgba(59, 130, 246, 0.02)
          );
        }

        .nf-card {
          display: flex;
          gap: 32px;
          align-items: center;
          max-width: 980px;
          width: 100%;
          padding: 28px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(6px);
        }

        .nf-content {
          flex: 1;
          min-width: 220px;
        }

        .nf-code {
          margin: 0;
          font-size: 56px;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #155dfc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        .nf-heading {
          margin: 6px 0 12px 0;
          font-size: 20px;
          color: #0f172a;
          font-weight: 600;
        }

        .nf-desc {
          margin: 0 0 18px 0;
          color: #334155;
          line-height: 1.5;
        }

        .nf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          color: #0f172a;
          background: transparent;
          text-decoration: none;
        }

        .btn.primary {
          background: linear-gradient(90deg, #06b6d4, #3b82f6);
          color: white;
          border: none;
          box-shadow: 0 6px 18px rgba(59, 130, 246, 0.18);
        }

        @media (max-width: 720px) {
          .nf-card {
            flex-direction: column;
            padding: 20px;
            gap: 18px;
          }
          .nf-illustration {
            width: 140px;
            height: 140px;
            flex: 0 0 140px;
          }
          .nf-code {
            font-size: 44px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .nf-root {
            background: linear-gradient(
              180deg,
              rgba(2, 6, 23, 0.5),
              rgba(2, 6, 23, 0.6)
            );
          }
          .nf-card {
            background: rgba(6, 8, 15, 0.6);
            box-shadow: none;
            color: #cbd5e1;
          }
          .nf-heading,
          .nf-desc {
            color: #cbd5e1;
          }
          .btn {
            border-color: rgba(255, 255, 255, 0.06);
            color: #e6eef8;
          }
        }
      `}</style>
    </main>
  );
}
