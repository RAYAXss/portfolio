import { MotionValue, motion, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect } from 'react';

type PlaceValue = number | '.';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, latest => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <motion.span style={{ ...baseStyle, y }}>{number}</motion.span>;
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const valueRoundedToPlace = getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <span className="relative inline-flex overflow-hidden" style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface DecimalDotProps {
  height: number;
  digitStyle?: React.CSSProperties;
}

function DecimalDot({ height, digitStyle }: DecimalDotProps) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ height, width: 'fit-content', ...digitStyle }}>
      .
    </span>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: PlaceValue[];
  gap?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
}

/**
 * Compteur animé par roue de chiffres (Counter reactbits, port framer-motion).
 */
export default function Counter({
  value,
  fontSize = 48,
  padding = 0,
  places = [...value.toString()].map((ch, i, a) => {
    if (ch === '.') return '.';
    const dotIndex = a.indexOf('.');
    const isInteger = dotIndex === -1;
    const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
    return 10 ** exponent;
  }),
  gap = 6,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
}: CounterProps) {
  const height = fontSize + padding;

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        lineHeight: 1,
        color: textColor,
        fontWeight,
        ...containerStyle,
      }}
    >
      <span
        style={{
          display: 'flex',
          gap,
          overflow: 'hidden',
          paddingLeft: 0,
          paddingRight: 0,
          ...counterStyle,
        }}
      >
        {places.map((place, i) =>
          place === '.' ? (
            <DecimalDot key={`dot-${i}`} height={height} digitStyle={digitStyle} />
          ) : (
            <Digit key={`digit-${i}`} place={place} value={value} height={height} digitStyle={digitStyle} />
          )
        )}
      </span>
    </span>
  );
}