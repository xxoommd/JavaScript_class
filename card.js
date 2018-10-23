const [JOKER, SPADE, DIAMOND, HEART, CLUB] = 
    [0, 1, 2, 3, 4]
const ICON = ['🃏', '♠️', '♦️', '♥️', '♣️']
const DISPLAY = ['0', 'A', '2', '3', '4', '5',
'6', '7', '8', '9', '10', 'J', 'Q', 'K', 'R', 'B']

class Card {
    constructor(type, value) {
        this.type = type
        this.value = value
    }

    get t() { return this.type }
    get v() { return this.value }

    /**
     * @param
     * @return {Card}
     */
    static createRandom() {
        let value = Math.ceil(Math.random() * 15)
        let type = value > 13 ? JOKER : Math.ceil(Math.random() * 4)
        const card = new Card(type, value)
        return card
    }

    toString() {
        return `${ICON[this.t]} ${DISPLAY[this.v]}`
    }
}

class FiveCards extends Array {
    /**
     * @param 
     * @return {FiveCards}
     */
    static createRandom() {
        const cards = new FiveCards()
        while(cards.length < 5) {
            const card = Card.createRandom()
            if (!cards.include(card)) {
                cards.push(card)
            }
        }
        return cards
    }

    /**
     * @param {Card} card 
     * @return {Boolean}
     */
    include(card) {
        for (const c of this) {
            if (c.t === card.t && c.v === card.v) {
                return true
            }
        }
        return false
    }

    /**
     * @return {Array} [[jokers], [normals]]
     */
    splitJoker() {
        const [j, n] = [[], []]
        this.forEach((c, i) => {
            c.t === JOKER ? j.push(i) : n.push(i)
        })
        return [j, n]
    }

    /**
     * 查找非JOKER牌面最多的卡牌数量
     * @return {Number}
     */
    findMaxValue() {
        const r = {}
        this.forEach(c => {
            if (!r[c.v.toString()]) {
                r[c.v.toString()] = 0
            }
            r[c.v.toString()]++
        })

        let max = -1
        for (let k in r) {
            if (r[k] > max) max = r[k]
        }

        return max
    }

    toString() {
        let str = ''
        this.forEach(c => {
            str += c.toString() + ' '
        })
        return str
    }
}

const JUDGES = new Map([
    ['5K', function(cards) {
        const [jokers, normals] = cards.splitJoker()
        if (jokers.length === 0) {
            return false
        }

        let max = cards.findMaxValue()
        if (jokers.length + max === 5) {
            return true
        }

        return false
    } ],
    ['RS', function(cards) { return false } ],
    ['SF', function(cards) { return false } ],
    ['4K', function(cards) {
        const [jokers, normals] = cards.splitJoker()
        let max = cards.findMaxValue()
        return jokers.length + max === 4
    } ],
    ['FH', function(cards) { return false } ],
    ['FL', function(cards) { return false } ],
    ['ST', function(cards) { return false } ],
    ['3K', function(cards) { return false } ],
    ['2P', function(cards) { return false } ],
    ['1P', function(cards) { return false } ]
])

/**
 * @param {FiveCards} cards
 * @return {String}
 */
let judgeCards = function(cards) {
    for (let [r, h] of JUDGES.entries()) {
        if (h(cards)) {
            return r
        }
    }

    return null
}

for (let i = 0; i < 10000; i++) {
    const cards = FiveCards.createRandom()
    const result = judgeCards(cards)
    if (result) {
        console.log(cards.toString(), ' Result: ', result)
    }
}
