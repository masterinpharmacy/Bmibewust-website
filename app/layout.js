export const metadata = {
  title: "BMI Bewust — Medische begeleiding bij gewichtsverlies",
  description:
    "Gezond en veilig afvallen met professionele hulp van huisarts en apotheek. Meld je aan en wij nemen binnen 24 uur contact op.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
