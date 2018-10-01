(function ($) {

      $(document).ready(() => {

            $(document).on('click', '.chip .close', function () {

                  const $this = $(this);

                  if ($this.closest('.chips').data('initialized')) {
                        return;
                  }

                  $this.closest('.chip').remove();
            });
      });

      $.fn.materialChip = function (options) {

            this.$el = $(this);
            this.$document = $(document);

            this.eventsHandled = false;

            this.defaultOptions = {
                  data: [],
                  placeholder: '',
                  secondaryPlaceholder: ''
            };

            this.selectors = {
                  chips: '.chips',
                  chip: '.chip',
                  input: 'input',
                  delete: '.fa',
                  selectedChip: '.selected'
            };

            this.keyCodes = {
                  enter: 13,
                  backspace: 8,
                  delete: 46,
                  arrowLeft: 37,
                  arrowRight: 39
            };

            if (options === 'data') {
                  return this.$el.data('chips');
            }

            if (options === 'options') {
                  return this.$el.data('options');
            }

            this.$el.data('options', $.extend({}, this.defaultOptions, options));

            this.init = () => {

                  this.$el.each((index, element) => {

                        const $this = $(element);
                        if ($this.data('initialized')) {
                              return;
                        }

                        const options = $this.data('options');
                        if (!options.data || !Array.isArray(options.data)) {
                              options.data = [];
                        }

                        $this.data('chips', options.data);
                        $this.data('index', index);
                        $this.data('initialized', true);

                        if (!$this.hasClass(this.selectors.chips)) {
                              $this.addClass('chips');
                        }

                        this.renderChips($this);
                  });
            };

            this.handleEvents = function () {

                  this.$document.on('click', this.selectors.chips, e => {

                        $(e.target).find(this.selectors.input).focus();
                  });

                  this.$document.on('click', this.selectors.chip, e => {

                        $(this.selectors.chip).removeClass('selected');
                        $(e.target).addClass('selected');
                  });

                  this.$document.on('keydown', e => {

                        if ($(e.target).is('input, textarea')) {
                              return;
                        }

                        const $selectedChip = this.$document.find(this.selectors.chip + this.selectors.selectedChip);
                        const $chipsWrapper = $selectedChip.closest(this.selectors.chips);
                        const siblingsLength = $selectedChip.siblings(this.selectors.chip).length;

                        if (!$selectedChip.length) {
                              return;
                        }

                        const backspacePressed = e.which === this.keyCodes.backspace;
                        const deletePressed = e.which === this.keyCodes.delete;
                        const leftArrowPressed = e.which === this.keyCodes.arrowLeft;
                        const rightArrowPressed = e.which === this.keyCodes.arrowRight;

                        if (backspacePressed || deletePressed) {

                              e.preventDefault();

                              this.deleteSelectedChip($chipsWrapper, $selectedChip, siblingsLength);
                        } else if (leftArrowPressed) {

                              this.selectLeftChip($chipsWrapper, $selectedChip);
                        } else if (rightArrowPressed) {

                              this.selectRightChip($chipsWrapper, $selectedChip, siblingsLength);
                        }
                  });

                  this.$document.on('focusin', `${this.selectors.chips} ${this.selectors.input}`, e => {

                        $(e.target).closest(this.selectors.chips).addClass('focus');
                        $(this.selectors.chip).removeClass('selected');
                  });

                  this.$document.on('focusout', `${this.selectors.chips} ${this.selectors.input}`, e => {

                        $(e.target).closest(this.selectors.chips).removeClass('focus');
                  });

                  this.$document.on('keydown', `${this.selectors.chips} ${this.selectors.input}`, e => {

                        const $target = $(e.target);
                        const $chipsWrapper = $target.closest(this.selectors.chips);
                        const chipsIndex = $chipsWrapper.data('index');
                        const chipsLength = $chipsWrapper.children(this.selectors.chip).length;

                        const enterPressed = e.which === this.keyCodes.enter;

                        if (enterPressed) {

                              e.preventDefault();

                              this.addChip(chipsIndex, {
                                    tag: $target.val()
                              }, $chipsWrapper);

                              $target.val('');

                              return;
                        }

                        const leftArrowOrDeletePressed = e.keyCode === this.keyCodes.arrowLeft || e.keyCode === this.keyCodes.delete;
                        const isValueEmpty = $target.val() === '';

                        if (leftArrowOrDeletePressed && isValueEmpty && chipsLength) {

                              this.selectChip(chipsIndex, chipsLength - 1, $chipsWrapper);

                              $target.blur();
                        }
                  });

                  this.$document.on('click', `${this.selectors.chips} ${this.selectors.delete}`, e => {

                        const $target = $(e.target);
                        const $chipsWrapper = $target.closest(this.selectors.chips);
                        const $chip = $target.closest(this.selectors.chip);

                        e.stopPropagation();

                        this.deleteChip($chipsWrapper.data('index'), $chip.index(), $chipsWrapper);

                        $chipsWrapper.find('input').focus();
                  });
            };

            this.deleteSelectedChip = ($chipsWrapper, $selectedChip, siblingsLength) => {

                  const chipsIndex = $chipsWrapper.data('index');
                  const chipIndex = $selectedChip.index();
                  this.deleteChip(chipsIndex, chipIndex, $chipsWrapper);

                  let selectIndex = null;

                  if (chipIndex < siblingsLength - 1) {
                        selectIndex = chipIndex;
                  } else if (chipIndex === siblingsLength || chipIndex === siblingsLength - 1) {
                        selectIndex = siblingsLength - 1;
                  }

                  if (selectIndex < 0) {
                        selectIndex = null;
                  }

                  if (selectIndex !== null) {
                        this.selectChip(chipsIndex, selectIndex, $chipsWrapper);
                  }

                  if (!siblingsLength) {
                        $chipsWrapper.find('input').focus();
                  }
            };

            this.selectLeftChip = ($chipsWrapper, $selectedChip) => {

                  const chipIndex = $selectedChip.index() - 1;
                  if (chipIndex < 0) {
                        return;
                  }

                  $(this.selectors.chip).removeClass('selected');

                  this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
            };

            this.selectRightChip = ($chipsWrapper, $selectedChip, siblingsLength) => {

                  const chipIndex = $selectedChip.index() + 1;
                  $(this.selectors.chip).removeClass('selected');
                  if (chipIndex > siblingsLength) {

                        $chipsWrapper.find('input').focus();
                        return;
                  }

                  this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
            };

            this.renderChips = $chipsWrapper => {

                  let html = '';

                  $chipsWrapper.data('chips').forEach(elem => {

                        html += this.getSingleChipHtml(elem);
                  });

                  html += '<input class="input" placeholder="">';

                  $chipsWrapper.html(html);

                  this.setPlaceholder($chipsWrapper);
            };

            this.getSingleChipHtml = function (elem) {

                  if (!elem.tag) {
                        return '';
                  }

                  let html = `<div class="chip">${elem.tag}`;

                  if (elem.image) {
                        html += ` <img src="${elem.image}"> `;
                  }

                  html += '<i class="close fa fa-times"></i>';
                  html += '</div>';

                  return html;
            };

            this.setPlaceholder = function ($chips) {

                  const options = $chips.data('options');

                  if ($chips.data('chips').length && options.placeholder) {

                        $chips.find('input').prop('placeholder', options.placeholder);
                  } else if (!$chips.data('chips').length && options.secondaryPlaceholder) {

                        $chips.find('input').prop('placeholder', options.secondaryPlaceholder);
                  }
            };

            this.isValid = function ($chipsWrapper, elem) {

                  const chips = $chipsWrapper.data('chips');

                  for (let i = 0; i < chips.length; i++) {

                        if (chips[i].tag === elem.tag) {

                              return false;
                        }
                  }

                  return elem.tag !== '';
            };

            this.addChip = (chipsIndex, elem, $chipsWrapper) => {

                  if (!this.isValid($chipsWrapper, elem)) {
                        return;
                  }

                  const chipHtml = this.getSingleChipHtml(elem);

                  $chipsWrapper.data('chips').push(elem);

                  $(chipHtml).insertBefore($chipsWrapper.find('input'));

                  $chipsWrapper.trigger('chip.add', elem);

                  this.setPlaceholder($chipsWrapper);
            };

            this.deleteChip = (chipsIndex, chipIndex, $chipsWrapper) => {

                  const chip = $chipsWrapper.data('chips')[chipIndex];

                  $chipsWrapper.find('.chip').eq(chipIndex).remove();
                  $chipsWrapper.data('chips').splice(chipIndex, 1);
                  $chipsWrapper.trigger('chip.delete', chip);

                  this.setPlaceholder($chipsWrapper);
            };

            this.selectChip = (chipsIndex, chipIndex, $chipsWrapper) => {

                  const $chip = $chipsWrapper.find('.chip').eq(chipIndex);

                  if ($chip && $chip.hasClass('selected') === false) {

                        $chip.addClass('selected');
                        $chipsWrapper.trigger('chip.select', $chipsWrapper.data('chips')[chipIndex]);
                  }
            };

            this.getChipsElement = (index, $chipsWrapper) => {
                  return $chipsWrapper.eq(index);
            };

            this.init();

            if (!this.eventsHandled) {

                  this.handleEvents();
                  this.eventsHandled = true;
            }

            return this;
      };

      // Deprecated. To be deleted in future releases
      $.fn.material_chip = $.fn.materialChip;
})(jQuery);