export const rabbitSays = (message: string, openEyes: boolean = false) => {
  const spaced = ' ' + message + ' ';
  const border = spaced.split('').map(c => '─').join('');

  if(openEyes) {
    console.log('  (\\(\\      ╭'+ border  +'╮'); // エスケープ分ずれる
    console.log(' ( o.o)    < '+ spaced +'│');
    console.log(' o_(")(")   ╰'+ border  +'╯');
  } else {
      console.log('  (\\(\\      ╭'+ border  +'╮'); // エスケープ分ずれる
      console.log(' ( -.-)    < '+ spaced +'│');
      console.log(' o_(")(")   ╰'+ border  +'╯');
  }
}