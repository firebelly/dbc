// Breakpoints

let breakpointIndicatorString, xl, lg, nav, md, sm, xs;

let Breakpoints = {xl,lg,nav,md,sm,xs};

function updateBreakpoints() {
  // Check breakpoint indicator in DOM ( :after { content } is controlled by CSS media queries )
  breakpointIndicatorString = window.getComputedStyle( document.querySelector('#breakpoint-indicator'), ':after' ).getPropertyValue('content').replace(/['"]+/g, '');

  Breakpoints['xl'] = breakpointIndicatorString === 'xl';
  Breakpoints['lg'] = breakpointIndicatorString === 'lg' || Breakpoints['xl'];
  Breakpoints['nav'] = breakpointIndicatorString === 'nav' || Breakpoints['lg'];
  Breakpoints['md'] = breakpointIndicatorString === 'md' || Breakpoints['nav'];
  Breakpoints['sm'] = breakpointIndicatorString === 'sm' || Breakpoints['md'];
  Breakpoints['xs'] = breakpointIndicatorString === 'xs' || Breakpoints['sm'];
}
updateBreakpoints();

window.onresize = updateBreakpoints;
console.log(Breakpoints);
export default Breakpoints
