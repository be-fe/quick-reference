/**
 * @file parent
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */


process.on('message', (data) => {
  console.log('I\'m child, data from parent: ', data)
})

console.log('I\'m child, mumbling to myself!')

process.send && process.send('I\'m child, Who are you?')
