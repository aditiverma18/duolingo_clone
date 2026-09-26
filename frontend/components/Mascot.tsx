"use client";

type MascotState = "happy" | "encouraging" | "celebrating" | "sad";

interface MascotProps {
  state?: MascotState;
  size?: number;
}

export default function Mascot({
  state = "happy",
  size = 130,
}: MascotProps) {
  const isSad = state === "sad";
  const isCelebrating = state === "celebrating";

  return (
    <div
      className={`mascot mascot-${state}`}
      style={{ width: size, height: size * 1.12 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 245"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse
          cx="110"
          cy="232"
          rx="68"
          ry="10"
          fill="rgba(0,0,0,0.12)"
        />

        {/* Ear tufts */}
        <path
          d="M48 62 L38 20 Q37 14 44 18 L77 43"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        <path
          d="M172 62 L182 20 Q183 14 176 18 L143 43"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Body */}
        <ellipse
          cx="110"
          cy="130"
          rx="82"
          ry="94"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="6"
        />

        {/* Belly */}
        <ellipse
          cx="110"
          cy="166"
          rx="48"
          ry="55"
          fill="#8EE000"
        />

        {/* Left wing */}
        <path
          d="M40 125
             Q13 134 19 165
             Q25 191 51 187
             Q67 184 69 161
             L61 134
             Q55 125 40 125Z"
          fill="#46A302"
        />

        <path
          d="M42 130
             Q23 140 28 161
             Q33 178 49 177
             Q59 174 61 157
             L55 137
             Q51 130 42 130Z"
          fill="#58CC02"
        />

        {/* Right wing */}
        <path
          d="M180 125
             Q207 134 201 165
             Q195 191 169 187
             Q153 184 151 161
             L159 134
             Q165 125 180 125Z"
          fill="#46A302"
        />

        <path
          d="M178 130
             Q197 140 192 161
             Q187 178 171 177
             Q161 174 159 157
             L165 137
             Q169 130 178 130Z"
          fill="#58CC02"
        />

        {/* Face */}
        <ellipse
          cx="110"
          cy="102"
          rx="72"
          ry="67"
          fill="#58CC02"
        />

        {/* Left eye white */}
        <ellipse
          cx="78"
          cy="96"
          rx="29"
          ry="34"
          fill="white"
        />

        {/* Right eye white */}
        <ellipse
          cx="142"
          cy="96"
          rx="29"
          ry="34"
          fill="white"
        />

        {/* Pupils */}
        {!isSad ? (
          <>
            <ellipse
              cx="82"
              cy="99"
              rx="10"
              ry="17"
              fill="#3C3C3C"
            />

            <ellipse
              cx="138"
              cy="99"
              rx="10"
              ry="17"
              fill="#3C3C3C"
            />

            {/* Eye highlights */}
            <circle cx="85" cy="93" r="3.5" fill="white" />
            <circle cx="141" cy="93" r="3.5" fill="white" />
          </>
        ) : (
          <>
            <path
              d="M66 101 Q78 89 90 101"
              fill="none"
              stroke="#3C3C3C"
              strokeWidth="7"
              strokeLinecap="round"
            />

            <path
              d="M130 101 Q142 89 154 101"
              fill="none"
              stroke="#3C3C3C"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Beak */}
        <path
          d="M110 108 L96 126 Q110 139 124 126 Z"
          fill="#FF9600"
          stroke="#D97700"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Happy mouth */}
        {!isSad && (
          <path
            d="M96 142 Q110 153 124 142"
            fill="none"
            stroke="#3C3C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}

        {/* Sad mouth */}
        {isSad && (
          <path
            d="M97 151 Q110 140 123 151"
            fill="none"
            stroke="#3C3C3C"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}

        {/* Cheeks */}
        <ellipse
          cx="54"
          cy="125"
          rx="11"
          ry="6"
          fill="#7DD800"
        />

        <ellipse
          cx="166"
          cy="125"
          rx="11"
          ry="6"
          fill="#7DD800"
        />

        {/* Feet */}
        <ellipse
          cx="80"
          cy="221"
          rx="20"
          ry="9"
          fill="#FF9600"
        />

        <ellipse
          cx="140"
          cy="221"
          rx="20"
          ry="9"
          fill="#FF9600"
        />

        {/* Celebration stars */}
        {isCelebrating && (
          <>
            <path
              d="M28 54 L32 65 L43 69 L32 73 L28 84 L24 73 L13 69 L24 65Z"
              fill="#FFC800"
            />

            <path
              d="M192 48 L196 59 L207 63 L196 67 L192 78 L188 67 L177 63 L188 59Z"
              fill="#FFC800"
            />

            <path
              d="M188 112 L191 120 L200 123 L191 126 L188 135 L185 126 L176 123 L185 120Z"
              fill="#FFC800"
            />
          </>
        )}
      </svg>
    </div>
  );
}