const SITE_CONFIG = {
    GA_MEASUREMENT_ID: "G-GGRME39GPP",
    WHATSAPP_NUMBER: "5555936190578",
    CONSENT_KEY: "guarienti_cookie_consent"
};

const ICON_SPINNER =
    '<svg class="icon icon-spin" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';

const ICON_CHECK_CIRCLE =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

function formatPhoneBR(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const subjectInput = form.querySelector('input[name="subject"]');
    const deptSelect = form.querySelector("#departamento");
    const phoneInput = form.querySelector("#telefone");

    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = formatPhoneBR(phoneInput.value);
        });
    }

    const showStatus = (type, html) => {
        if (statusEl) {
            statusEl.className = `form-status ${type}`;
            statusEl.innerHTML = html;
            statusEl.hidden = false;
        }
    };

    const buildWhatsAppUrl = (formData) => {
        const departamento = formData.get("departamento") || "Comercial";
        const empresa = (formData.get("empresa") || "").trim();
        const lines = [
            "Olá! Vim pelo site e gostaria de falar com a equipe.",
            `*Departamento:* ${departamento}`,
            `*Nome:* ${formData.get("nome") || ""}`
        ];
        if (empresa) lines.push(`*Empresa/Cidade:* ${empresa}`);
        lines.push(
            `*E-mail:* ${formData.get("email") || ""}`,
            `*Telefone:* ${formData.get("telefone") || ""}`,
            `*Mensagem:* ${formData.get("mensagem") || ""}`
        );
        return `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (subjectInput && deptSelect && deptSelect.value) {
            subjectInput.value = `Novo contato (${deptSelect.value}) - Frigorífico Guarienti`;
        }

        const formData = new FormData(form);
        const hasValidKey = accessKeyInput && accessKeyInput.value && !accessKeyInput.value.startsWith("COLE_");

        if (!hasValidKey) {
            trackEvent("generate_lead", { method: "whatsapp_fallback", departamento: formData.get("departamento") || "" });
            window.open(buildWhatsAppUrl(formData), "_blank", "noopener");
            showStatus("success", "Abrimos o WhatsApp com a sua mensagem. É só tocar em <strong>enviar</strong>.");
            return;
        }

        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `${ICON_SPINNER} Enviando...`;
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Falha no envio");
            }

            trackEvent("generate_lead", {
                method: "formulario",
                departamento: formData.get("departamento") || ""
            });
            showStatus(
                "success",
                `${ICON_CHECK_CIRCLE} Mensagem enviada! Nossa equipe retornará em breve.`
            );
            form.reset();
        } catch (err) {
            const waUrl = buildWhatsAppUrl(formData);
            showStatus(
                "error",
                `Não foi possível enviar agora. <a href="${waUrl}" target="_blank" rel="noopener noreferrer" data-track="formulario_fallback">Envie pelo WhatsApp</a> ou escreva para <a href="mailto:comercial@frigorificoguarienti.com.br">comercial@frigorificoguarienti.com.br</a>.`
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        }
    });
}

function getConsent() {
    try {
        return localStorage.getItem(SITE_CONFIG.CONSENT_KEY);
    } catch (err) {
        return null;
    }
}

function setConsent(value) {
    try {
        localStorage.setItem(SITE_CONFIG.CONSENT_KEY, value);
    } catch (err) {
        // Ignora erro caso localStorage esteja indisponível
    }
}

function loadGoogleAnalytics() {
    const measurementId = SITE_CONFIG.GA_MEASUREMENT_ID;
    if (!measurementId || window.__gaLoaded) return;

    window.__gaLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
}

function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    }
}

function initConsentAndAnalytics() {
    const hasGa = Boolean(SITE_CONFIG.GA_MEASUREMENT_ID);
    const consent = getConsent();

    if (hasGa && consent === "granted") {
        loadGoogleAnalytics();
    }
    if (hasGa && !consent) {
        showCookieBanner();
    }

    document.querySelectorAll("[data-cookie-preferences]").forEach((btn) => {
        if (hasGa) {
            btn.addEventListener("click", () => showCookieBanner());
        } else {
            btn.hidden = true;
        }
    });

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href") || "";
        if (href.includes("wa.me/")) {
            trackEvent("contato_whatsapp", { link_location: link.dataset.track || "site" });
        } else if (href.startsWith("mailto:")) {
            trackEvent("contato_email", { email: href.replace("mailto:", "") });
        } else if (href.startsWith("tel:")) {
            trackEvent("contato_telefone");
        }
    });
}

function showCookieBanner() {
    if (document.getElementById("cookie-banner")) return;

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.innerHTML = `
        <p>Usamos cookies de análise para entender como o site é utilizado e melhorar sua experiência.
        Saiba mais na nossa <a href="privacidade.html">Política de Privacidade</a>.</p>
        <div class="cookie-actions">
            <button type="button" class="btn btn-outline" id="cookie-reject">Recusar</button>
            <button type="button" class="btn btn-primary" id="cookie-accept">Aceitar</button>
        </div>`;

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("show"));

    const closeBanner = () => {
        banner.classList.remove("show");
        setTimeout(() => banner.remove(), 400);
    };

    banner.querySelector("#cookie-accept").addEventListener("click", () => {
        setConsent("granted");
        loadGoogleAnalytics();
        closeBanner();
    });

    banner.querySelector("#cookie-reject").addEventListener("click", () => {
        setConsent("denied");
        closeBanner();
    });
}

function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    items.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            items.forEach((other) => {
                if (other !== item && other.open) other.open = false;
            });
        });
    });

    document.querySelectorAll("[data-select-dept]").forEach((link) => {
        link.addEventListener("click", () => {
            const deptSelect = document.getElementById("departamento");
            if (deptSelect && link.dataset.selectDept) {
                deptSelect.value = link.dataset.selectDept;
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener(
        "scroll",
        () => {
            const scrollY = window.scrollY;
            if (header) header.classList.toggle("scrolled", scrollY > 50);
            if (backToTopBtn) backToTopBtn.classList.toggle("show", scrollY > 300);
        },
        { passive: true }
    );

    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");

    function toggleMenu(open) {
        if (!menuBtn || !navMenu) return;

        navMenu.classList.toggle("active", open);
        document.body.classList.toggle("no-scroll", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            const willOpen = !navMenu.classList.contains("active");
            toggleMenu(willOpen);
            if (willOpen) {
                const firstLink = navMenu.querySelector("a");
                if (firstLink) firstLink.focus();
            }
        });

        navMenu.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => toggleMenu(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navMenu.classList.contains("active")) {
                toggleMenu(false);
            }
        });

        document.addEventListener("click", (event) => {
            if (
                navMenu.classList.contains("active") &&
                !navMenu.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                toggleMenu(false);
            }
        });
    }

    const fadeElements = document.querySelectorAll(".fade-in");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );
        fadeElements.forEach((el) => observer.observe(el));
    } else {
        fadeElements.forEach((el) => el.classList.add("visible"));
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('#nav-menu a.nav-link[href^="#"]'));
    if (!navLinks.length) return;

    const entries = navLinks
        .map((link) => {
            const target = document.querySelector(link.getAttribute("href"));
            return target ? { link, target } : null;
        })
        .filter(Boolean);

    if (!entries.length) return;

    const updateActive = () => {
        const scrollPos = window.scrollY + 140;
        let current = entries[0];
        for (const item of entries) {
            if (item.target.offsetTop <= scrollPos) {
                current = item;
            }
        }
        entries.forEach(({ link }) => {
            link.classList.toggle("active", link === current.link);
        });
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
}

    initContactForm();
    initFaqAccordion();
    initScrollSpy();
    initConsentAndAnalytics();
});
