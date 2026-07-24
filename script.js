(() => {
	const year = document.getElementById("year");
	if (year) year.textContent = String(new Date().getFullYear());

	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	// ── Loading screen ──
	const loader = document.getElementById("loader");
	const loaderName = document.getElementById("loader-name");
	const loaderRole = document.getElementById("loader-role");

	function finishLoading() {
		if (!loader) return;
		loader.classList.add("hidden");
		setTimeout(() => {
			loader.style.display = "none";
		}, 700);
		// start page animations after loader hides
		if (!reduce && typeof anime !== "undefined") startAnimations();
	}

	if (loader && loaderName && !reduce && typeof anime !== "undefined") {
		// load anime.js from CDN synchronously for loader timing
		const name = "Delia Anggraeni";
		loaderName.innerHTML = "";
		const letters = [];
		for (const ch of name) {
			const span = document.createElement("span");
			span.className = "loader-letter";
			span.textContent = ch === " " ? "\u00A0" : ch;
			loaderName.appendChild(span);
			letters.push(span);
		}

		// stagger letters in
		anime({
			targets: letters,
			opacity: [0, 1],
			translateY: [40, 0],
			rotateX: [90, 0],
			easing: "easeOutElastic(1, .6)",
			duration: 800,
			delay: anime.stagger(60),
			complete: () => {
				// fade in the role subtitle
				anime({
					targets: loaderRole,
					opacity: [0, 1],
					translateY: [12, 0],
					easing: "easeOutCubic",
					duration: 500,
					complete: () => {
						// hold, then fade out loader
						setTimeout(finishLoading, 1000);
					},
				});
			},
		});
	} else if (loader) {
		// reduced motion or no anime: skip directly
		loader.style.display = "none";
		if (!reduce && typeof anime !== "undefined") startAnimations();
	}

	// ── Nav toggle ──
	const nav = document.getElementById("site-nav");
	const toggle = document.querySelector(".nav-toggle");
	if (nav && toggle) {
		toggle.addEventListener("click", () => {
			const open = nav.classList.toggle("open");
			toggle.setAttribute("aria-expanded", open ? "true" : "false");
			toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
		});
		for (const link of nav.querySelectorAll("a")) {
			link.addEventListener("click", () => {
				nav.classList.remove("open");
				toggle.setAttribute("aria-expanded", "false");
				toggle.setAttribute("aria-label", "Buka menu");
			});
		}
	}

	// ── Active nav on scroll ──
	const navLinks = [...document.querySelectorAll("[data-nav]")];
	const sections = navLinks
		.map((a) => document.querySelector(a.getAttribute("href")))
		.filter(Boolean);

	function setActiveNav() {
		const y = window.scrollY + 96;
		let current = sections[0];
		for (const sec of sections) {
			if (sec && sec.offsetTop <= y) current = sec;
		}
		for (const link of navLinks) {
			const on = current && link.getAttribute("href") === `#${current.id}`;
			link.classList.toggle("is-active", Boolean(on));
		}
	}

	setActiveNav();
	window.addEventListener("scroll", setActiveNav, { passive: true });

	// ── Skill bars ──
	const fills = document.querySelectorAll(".skillbar-fill[data-level]");

	function fillBars() {
		for (const el of fills) {
			const level = Math.max(0, Math.min(100, Number(el.dataset.level) || 0));
			el.style.width = `${level}%`;
		}
	}

	if (fills.length) {
		if (reduce || !("IntersectionObserver" in window)) {
			fillBars();
		} else {
			const barRoot = document.querySelector(".skillbars");
			if (barRoot) {
				const barIo = new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							if (!entry.isIntersecting) continue;
							fillBars();
							barIo.disconnect();
						}
					},
					{ threshold: 0.25 },
				);
				barIo.observe(barRoot);
			} else {
				fillBars();
			}
		}
	}

	// ── Scroll-reveal animations (called after loader) ──
	function startAnimations() {
		// Hero stagger
		anime({
			targets: ".anim-hero",
			opacity: [0, 1],
			translateY: [18, 0],
			easing: "easeOutCubic",
			duration: 700,
			delay: anime.stagger(90),
		});

		const reveals = document.querySelectorAll(".anim-reveal");
		if (!reveals.length) return;

		if (!("IntersectionObserver" in window)) {
			anime({ targets: reveals, opacity: 1, translateY: 0, duration: 1 });
			return;
		}

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = entry.target;
					io.unobserve(el);
					anime({
						targets: el,
						opacity: [0, 1],
						translateY: [22, 0],
						easing: "easeOutCubic",
						duration: 650,
					});
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		for (const el of reveals) io.observe(el);
	}

	// If loader was skipped and anime available, start now
	if (
		(!loader || loader.style.display === "none") &&
		!reduce &&
		typeof anime !== "undefined"
	) {
		startAnimations();
	}
})();
