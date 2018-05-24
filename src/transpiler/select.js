/**
 * @file select
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */
const nps = require('path')
const jsdiff = require('diff')

function calcDist(oldStr, newStr) {
  const diff = jsdiff.diffChars(oldStr, newStr)
  let dist = 0
  for (let i = 0; i < diff.length; i++) {
    const part = diff[i]
    // 从用户输入到匹配值，需要删除某值，被认为匹配失败
    if (part.removed) {
      return -1
    }

    // add -> dadd
    // add -> addd
    //  认为下面的可能更大
    if (part.added) {
      dist = dist + (diff.length - i)
    }
  }

  return dist
}

function select(alias, permalink, sameList) {
  let minDist = Number.MAX_SAFE_INTEGER
  let linkedFilename = alias[permalink]
  let matchedPermaLink = permalink

  for (let perma in alias) {
    let dist = calcDist(permalink, perma)
    if (dist < 0) {
      continue
    }

    if (dist < minDist) {
      minDist = dist
      matchedPermaLink = perma
      linkedFilename = alias[matchedPermaLink]
      sameList.push(nps.relative(process.cwd(), linkedFilename))
    } else if (dist === minDist) {
      sameList.push(nps.relative(process.cwd(), alias[perma]))
    }
  }

  return {
    matchedPermaLink,
    linkedFilename
  }
}

select.calcDist = calcDist
module.exports = select
