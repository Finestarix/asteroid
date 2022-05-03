import Document, {Head, Html, Main, NextScript} from "next/document";


export default class MyDocument extends Document {

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8"/>
                    <meta name="author" content="RX19-2 Renaldy, JG21-1 Jose Giancarlos"/>

                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}
