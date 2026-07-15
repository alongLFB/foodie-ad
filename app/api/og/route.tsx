import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getRestaurantById, mockRestaurants } from "@/lib/data";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const restaurant = id
    ? getRestaurantById(id)
    : mockRestaurants.find((r) => r.status === "approved");

  if (!restaurant) {
    return new Response("Restaurant not found", { status: 404 });
  }

  const funnyPhrases = [
    "如果你不请我吃这家店，我们就绝交吧",
    "这家店好吃到让我原谅了阿布扎比的停车费",
    "If you don't take me here, we're officially done",
    "This place made me forget about the Abu Dhabi parking fees",
    "我在阿布扎比找到了人生意义：就是这家店",
  ];

  const phrase = funnyPhrases[parseInt(restaurant.id) % funnyPhrases.length];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <img
          src={restaurant.coverImage}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt=""
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Funny headline */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#F5A623",
              lineHeight: 1.2,
              maxWidth: "900px",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {phrase}
          </div>

          {/* Restaurant name */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            🍽️ {restaurant.name}
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "8px",
            }}
          >
            {/* Rating */}
            <div
              style={{
                background: "rgba(245, 166, 35, 0.95)",
                padding: "8px 20px",
                borderRadius: "50px",
                fontSize: 22,
                fontWeight: 800,
                color: "white",
              }}
            >
              ⭐ {restaurant.rating.toFixed(1)} / 5.0
            </div>

            {/* Funny score */}
            <div
              style={{
                background: "rgba(255, 107, 107, 0.95)",
                padding: "8px 20px",
                borderRadius: "50px",
                fontSize: 22,
                fontWeight: 800,
                color: "white",
              }}
            >
              😂 × {restaurant.funnyScore}
            </div>

            {/* Site brand */}
            <div
              style={{
                marginLeft: "auto",
                background: "rgba(0,0,0,0.6)",
                padding: "8px 20px",
                borderRadius: "50px",
                fontSize: 18,
                fontWeight: 700,
                color: "white",
              }}
            >
              🍔 Foodie-AD
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
