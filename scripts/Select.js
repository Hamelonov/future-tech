class Select {
	constructor(root) {
		this.root = root
		this.originalSelect = this.root.querySelector('[data-js-select-original-controls]')
		this.button = this.root.querySelector('[data-js-select-button]')
		this.dropdown = this.root.querySelector('[data-js-select-dropdown]')
		this.options = Array.from(this.root.querySelectorAll('[data-js-select-option]'))

		if (!this.originalSelect || !this.button) return

		this.state = {
			isOpen: false,
			currentIndex: this.options.findIndex((opt) => opt.classList.contains('is-selected')) || 0
		}

		this._init()
	}

	_init() {
		// Клик по кнопке (открыть/закрыть)
		this.button.addEventListener('click', () => this._toggleDropdown())

		// Клик по пунктам списка
		this.options.forEach((option, index) => {
			option.addEventListener('click', () => {
				this._selectOption(index)
				this._closeDropdown()
			})
		})

		// Закрытие при клике вне селекта
		document.addEventListener('click', (e) => {
			if (!this.root.contains(e.target)) this._closeDropdown()
		})

		// Управление клавиатурой
		this.root.addEventListener('keydown', (e) => this._handleKeyDown(e))

		// Синхронизация, если нативный селект изменится (например, на мобилках)
		this.originalSelect.addEventListener('change', () => this._syncNativeToCustom())
	}

	_toggleDropdown() {
		this.state.isOpen ? this._closeDropdown() : this._openDropdown()
	}

	_openDropdown() {
		this.state.isOpen = true
		this.button.classList.add('is-expanded')
		this.dropdown.classList.add('is-expanded')
		this.button.setAttribute('aria-expanded', 'true')

		// Фокусируемся на текущем элементе для доступности
		this.options[this.state.currentIndex]?.focus()
	}

	_closeDropdown() {
		this.state.isOpen = false
		this.button.classList.remove('is-expanded')
		this.dropdown.classList.remove('is-expanded')
		this.button.setAttribute('aria-expanded', 'false')
	}

	_selectOption(index, dispatch = true) {
		const selectedOption = this.options[index]
		if (!selectedOption) return

		// 1. Обновляем визуальный класс
		this.options.forEach((opt) => opt.classList.remove('is-selected', 'is-current'))
		selectedOption.classList.add('is-selected', 'is-current')

		// 2. Обновляем текст на кнопке
		this.button.textContent = selectedOption.textContent.trim()

		// 3. Обновляем нативный селект
		if (this.originalSelect.selectedIndex !== index) {
			this.originalSelect.selectedIndex = index
		}

		this.state.currentIndex = index

		// 4. Генерируем событие только если это НЕ синхронизация
		// и только если мы хотим оповестить остальной код
		if (dispatch) {
			this.originalSelect.dispatchEvent(new Event('change'))
		}
	}

	_syncNativeToCustom() {
		// Проверяем, отличается ли уже выбранный индекс в кастомном от нативного
		// Если они уже равны, ничего не делаем, чтобы разорвать цикл
		if (this.state.currentIndex !== this.originalSelect.selectedIndex) {
			this._selectOption(this.originalSelect.selectedIndex, false)
		}
	}

	_handleKeyDown(e) {
		const { key } = e
		const lastIndex = this.options.length - 1

		if (key === 'Escape') this._closeDropdown()

		if (key === 'ArrowDown' || key === 'ArrowUp') {
			e.preventDefault()
			if (!this.state.isOpen) this._openDropdown()

			let newIndex = key === 'ArrowDown' ? this.state.currentIndex + 1 : this.state.currentIndex - 1

			if (newIndex < 0) newIndex = lastIndex
			if (newIndex > lastIndex) newIndex = 0

			this._updateCurrentFocus(newIndex)
		}

		if (key === 'Enter' && this.state.isOpen) {
			e.preventDefault()
			this._selectOption(this.state.currentIndex)
			this._closeDropdown()
			this.button.focus()
		}
	}

	_updateCurrentFocus(index) {
		this.options.forEach((opt) => opt.classList.remove('is-current'))
		this.options[index].classList.add('is-current')
		this.state.currentIndex = index
		this.options[index].scrollIntoView({ block: 'nearest' })
	}
}

// Коллекция для инициализации всех селектов на странице
class SelectCollection {
	constructor() {
		this.init()
	}

	init() {
		const selects = document.querySelectorAll('[data-js-select]')
		selects.forEach((select) => new Select(select))
	}
}

export default SelectCollection
