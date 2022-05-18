import Document, { Head, Html, Main, NextScript } from "next/document";


export default class MyDocument extends Document {
	
	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="UTF-8" />
					<meta name="author" content="RX19-2 Renaldy, JG21-1 Jose Giancarlos" />
					<meta name="theme-color" content="#fff" />
					
					<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/icon_512x512.png" />
				</Head>
				<body>
				<Main />
				<NextScript />
				</body>
			</Html>
		);
	}
}
