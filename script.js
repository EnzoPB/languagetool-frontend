function createElement(nodeName, opts = null, innerText = null, parent = null) {
	let el = document.createElement(nodeName);
	if (opts != null) {
		for (let opt of Object.keys(opts)) {
			el[opt] = opts[opt];
		}
	}
	el.innerText = innerText;
	if (parent != null) {
		parent.appendChild(el);
	}
	return el;
}

document.addEventListener('DOMContentLoaded', () => {
	const langs = document.getElementById('langs');
	const text = document.getElementById('text');
	const submit = document.getElementById('submit');
	const corrections = document.getElementById('corrections');
	let currentMatches;
	fetch(LT_CONFIG.api + '/v2/languages')
		.then(r => r.json())
		.then(data => {
			for (let lang of data) {
				let langEl = createElement('option', { value: lang.longCode }, `${lang.name} (${lang.longCode})`, langs);
				if (lang.longCode == LT_CONFIG.default_language) {
					langEl.selected = true;
				}
			}
		});

	submit.addEventListener('click', () => {
		submit.innerText = 'Loading...';
		submit.disabled = true;
		text.disabled = true;
		corrections.innerHTML = '';

		fetch(LT_CONFIG.api + '/v2/check', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				text: text.value,
				language: langs.value
			})
		})
			.then(r => r.json())
			.then(data => {
				submit.innerText = 'Submit';
				submit.disabled = false;
				text.disabled = false;
				currentMatches = data.matches;
				if (data.matches.length == 0) {
					corrections.innerText = 'No mistakes found';
				}
				for (let i in data.matches) {
					let match = currentMatches[i];
					let matchEl = createElement('div', { className: 'correction' }, null, corrections);
					createElement('h4', null, match.message, matchEl);
					createElement('pre', null, match.context.text.substring(match.context.offset, match.context.offset + match.context.length).trim(), matchEl);
					function locate() {
						let match = currentMatches[i];
						text.focus();
						text.setSelectionRange(match.offset, match.offset + match.length);
					}
					createElement('a', { href: 'javascript:void(0)', onclick: locate }, 'Locate', matchEl);
					let replacementsEl = createElement('ul', null, null, matchEl);
					for (let replacement of match.replacements) {
						let replacementEl = createElement('li', null, null, replacementsEl);
						createElement('pre', null, replacement.value.trim(), replacementEl);
						replacementEl.innerHTML += ' - ';
						function correct() {
							let match = currentMatches[i];
							matchEl.className += ' corrected'
							text.value = text.value.substring(0, match.offset) + replacement.value + text.value.substring(match.offset + match.length);
							for (let y in currentMatches) {
								if (i == y || match.offset > currentMatches[y].offset) { continue; }
								currentMatches[y].offset += replacement.value.length - match.length;
							}
							currentMatches[i].length = replacement.value.length;
						}
						createElement('a', { href: 'javascript:void(0)', onclick: correct }, 'Correct', replacementEl);
					}
				}
			});
	});
});