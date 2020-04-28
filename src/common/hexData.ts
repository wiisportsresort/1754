/** X/Y from top/left (in px) for each hex in one-based index format. */
export const hexLocations: Array<[number, number]> = [
  [0, 0], // empty here because of zero-indexing
  [600, 100], // 1
  [600, 170], // 2
  [600, 240], // 3
  [547, 135], // 4
  [547, 205], // 5
  [547, 275], // 6
  [547, 345], // 7
  [547, 415], // 8
  [494, 450], // 9
  [494, 380], // 10
  [494, 310], // 11
  [494, 240], // 12
  [494, 170], // 13
  [494, 100], // 14
  [441, 135], // 15
  [441, 205], // 16
  [441, 275], // 17
  [441, 345], // 18
  [441, 415], // 19
  [441, 485], // 20
  [388, 450], // 21
  [388, 380], // 22
  [388, 310], // 23
  [388, 240], // 24
  [388, 170], // 25
  [335, 205], // 26
  [335, 275], // 27
  [335, 345], // 28
  [335, 415], // 29
  [335, 485], // 30
  [282, 380], // 31
  [282, 240] // 32
];

/** CSS-formatted colors for each group. */
export const colors = {
  france: '#3498db',
  britain: '#e94858',
  mohawk: '#82bf6e',
  cherokee: '#9568d0',
  shawnee: '#f18836',
  miami: '#d075c3',
  ojibwe: '#fedc30'
};

export const defaultOwners = {
  france: [1, 4, 13, 14, 15, 16, 25],
  britain: [2, 3, 5, 6, 7, 8, 9],
  mohawk: [11, 12, 17, 18],
  cherokee: [10, 19, 20],
  shawnee: [21, 22, 29, 30],
  miami: [23, 24, 28, 31],
  ojibwe: [26, 27, 32],
}