import React from "react";
import "../styles/footer.css";

/**
 * Footer component rendered at the bottom of the application.
 * Displays attribution to the external data source (Amiibo API) with accessible external links.
 */
const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <p>
                Data obtained from{" "}
                <a
                    href="https://amiiboapi.com/"
                    title="See Amiibo API documentation"
                    aria-label="See Amiibo API documentation"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Amiibo API
                </a>
            </p>
        </footer>
    );
};

export default Footer;