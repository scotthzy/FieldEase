const { getBookingValidationError } = require('../../utils/booking-validation');

Page({
  data: {
    date: '',
    startTime: '',
    endTime: '',
    areaOptions: [
      { label: '全场', value: 'full', occupiedAreas: ['A', 'B', 'C', 'D', 'E', 'F'] },
      { label: '南半场', value: 'half_south', occupiedAreas: ['A', 'B'] },
      { label: '北半场', value: 'half_north', occupiedAreas: ['C', 'D'] },
      { label: '东南场', value: 'A', occupiedAreas: ['A'] },
      { label: '西南场', value: 'B', occupiedAreas: ['B'] },
      { label: '东北场', value: 'C', occupiedAreas: ['C'] },
      { label: '西北场', value: 'D', occupiedAreas: ['D'] },
      { label: '南禁区', value: 'E', occupiedAreas: ['E'] },
      { label: '北禁区', value: 'F', occupiedAreas: ['F'] }
    ],
    selectedAreaIndex: 0,
    selectedAreaLabel: '',
    selectedAreaValue: '',
    selectedOccupiedAreas: [],
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
  },

  onAreaChange(event) {
    const selectedAreaIndex = Number(event.detail.value);
    const selectedArea = this.data.areaOptions[selectedAreaIndex];

    if (!Number.isInteger(selectedAreaIndex) || !selectedArea) {
      return;
    }

    // Keep the display label and actual occupied areas from the same option.
    this.setData({
      selectedAreaIndex,
      selectedAreaLabel: selectedArea.label,
      selectedAreaValue: selectedArea.value,
      selectedOccupiedAreas: [...selectedArea.occupiedAreas]
    });
  },

  onSubmit() {
    const { date, startTime, endTime, selectedOccupiedAreas } = this.data;
    const errorMessage = getBookingValidationError({
      date,
      startTime,
      endTime,
      occupiedAreas: selectedOccupiedAreas
    });

    if (errorMessage) {
      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2500
      });
      return;
    }

    // Replace this notice with a cloud function call when submission is connected.
    wx.showModal({
      title: '表单校验通过',
      content: '预约提交功能尚未接入，本次未创建预约。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
