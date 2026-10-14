Page({
  data: {
    date: '',
    startTime: '',
    endTime: '',
    statusBarHeight: 0,
    navigationBarHeight: 44,
    navigationRightPadding: 108
  },

  onLoad() {
    this.updateNavigationLayout();
  },

  onResize() {
    this.updateNavigationLayout();
  },

  updateNavigationLayout() {
    const windowInfo = wx.getWindowInfo();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = windowInfo.statusBarHeight || 0;
    const hasMenuButton = menuButton.height > 0 &&
      menuButton.width > 0 && menuButton.top >= statusBarHeight;

    // Keep equal space above and below the capsule, outside the status bar.
    const menuButtonGap = hasMenuButton ? menuButton.top - statusBarHeight : 0;
    const navigationBarHeight = hasMenuButton
      ? menuButton.height + menuButtonGap * 2
      : 44;
    const navigationRightPadding = hasMenuButton
      ? Math.max(16, windowInfo.windowWidth - menuButton.left + 12)
      : 108;

    this.setData({
      statusBarHeight,
      navigationBarHeight,
      navigationRightPadding
    });
  },

  onDateChange(event) {
    this.setData({
      date: event.detail.value
    });
  },

  onStartTimeChange(event) {
    this.setData({
      startTime: event.detail.value
    });
  },

  onEndTimeChange(event) {
    this.setData({
      endTime: event.detail.value
    });
  }
});
