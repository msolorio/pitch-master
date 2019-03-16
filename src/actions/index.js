export const NAV_BUTTON_CLICK = 'NAV_BUTTON_CLICK';

export const navButtonClick = (viewToShow) => {
  console.log("in navButtonClick:", viewToShow);
  return {
    type: NAV_BUTTON_CLICK,
    viewToShow
  };
}