export const darkModeHandler = () => {
	const darkModeSwitcher = document.getElementById("toggleDarkMode");
	const htmlElement = document.documentElement;

	if (localStorage.getItem("mode") === "dark") {
		htmlElement.classList.add("dark");
		darkModeSwitcher.checked = true;
	}

	darkModeSwitcher.addEventListener("input", () => {
		htmlElement.classList.toggle("dark");

		htmlElement.classList.contains("dark")
			? localStorage.setItem("mode", "dark")
			: localStorage.setItem("mode", "light");
	});
};
