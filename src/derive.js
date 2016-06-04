export const map2 = T =>
  (fn, t1, t2) => T.ap(T.map(x1 => x2 => fn(x1, x2), t1), t2)

export const map3 = T =>
  (fn, t1, t2, t3) => T.ap(T.ap(T.map(x1 => x2 => x3 => fn(x1, x2, x3), t1), t2), t3)

export const ap = T =>
  (tf, tx) => T.chain(f => T.map(f, tx), tf)

export const mapViaApplicative = T =>
  (fn, tx) => T.ap(T.of(fn), tx)

export const mapViaMonad = T =>
  (fn, tx) => T.chain(x => T.of(fn(x)), tx)

export const traverse = T =>
  (Inner, fn, tx) => T.sequence(Inner, T.map(fn, tx))

export const join = T =>
  (tt) => T.chain(t => t, tt)

export const chain = T =>
  (fn, tx) => T.join(T.map(fn, tx))

export const reduce = T =>
  (f, acc, t) => {
    const of = () => acc
    const map = (_, x) => x
    const ap = f
    return T.sequence({of, map, ap}, t)
  }


export const deriveAll = T => {

  const added = {}

  if (T.join === undefined && T.chain) {
    added.join = join(T)
  }

  if (T.chain === undefined && T.join && T.map) {
    added.chain = chain(T)
  }

  if (T.map === undefined && T.of && T.chain) {
    added.map = mapViaMonad(T)
  }

  if (T.ap === undefined && T.map && T.chain) {
    added.ap = ap(T)
  }

  if (T.map2 === undefined && T.ap && T.map) {
    added.map2 = map2(T)
  }

  if (T.map3 === undefined && T.ap && T.map) {
    added.map3 = map3(T)
  }

  if (T.map === undefined && T.of && T.ap) {
    added.map = mapViaApplicative(T)
  }

  if (T.traverse === undefined && T.map && T.sequence) {
    added.traverse = traverse(T)
  }

  if(T.reduce === undefined && T.sequence) {
    added.reduce = reduce(T)
  }

  return {...T, ...added}

}
