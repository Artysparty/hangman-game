export const getRandomWord = async () => {
	let word = fetch("https://random-word-api.herokuapp.com/word")
		.then((response) => response.json())
		.then((word) => {
			return word;
		});

	return word;
};
