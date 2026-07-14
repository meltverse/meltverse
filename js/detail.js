/* MELT VERSE ― 詳細ページ共通スクリプト
   ・.thumb-grid（キャラクタータブ／ギャラリータブ共通）のサムネイルクリックで
     共通ライトボックスを開き、◀▶で同じグループ内の画像を循環表示する。
   タブ切り替え自体は純CSS（radio）のため、ここでは扱わない。 */
document.addEventListener('DOMContentLoaded', () => {

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
  let activeController = null;

  function syncLightbox() {
    if (!activeController) return;
    const { src, alt } = activeController.current();
    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', alt);
    if (lightboxCounter) {
      lightboxCounter.textContent = `${activeController.index + 1} / ${activeController.count}`;
    }
  }
  function openLightbox(controller) {
    activeController = controller;
    syncLightbox();
    const multi = controller.count > 1;
    if (lightboxPrev) lightboxPrev.style.display = multi ? '' : 'none';
    if (lightboxNext) lightboxNext.style.display = multi ? '' : 'none';
    if (lightboxCounter) lightboxCounter.style.display = multi ? '' : 'none';
    lightbox?.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox?.classList.remove('is-open');
    activeController = null;
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev?.addEventListener('click', () => activeController?.prev());
  lightboxNext?.addEventListener('click', () => activeController?.next());
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') activeController?.prev();
    if (e.key === 'ArrowRight') activeController?.next();
  });

  /* ---- サムネイルグリッド（キャラクタータブ／ギャラリータブ共通） ---- */
  document.querySelectorAll('.thumb-grid').forEach((grid) => {
    const items = Array.from(grid.querySelectorAll('.thumb-item'));

    const controller = {
      index: 0,
      count: items.length,
      current() {
        const img = items[this.index].querySelector('img');
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
      },
      prev() { this.index = (this.index - 1 + this.count) % this.count; syncLightbox(); },
      next() { this.index = (this.index + 1) % this.count; syncLightbox(); },
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        controller.index = i;
        openLightbox(controller);
      });
    });
  });

});
