# Verification harness

Built during the maintainability refactor, which had one hard requirement: the
rendered page must not change. The name is from that; the checks outlive it,
because they are what makes it safe to move CSS around again.

Each one exists because it catches something the others cannot.

| Script | What it proves |
|---|---|
| `shoot.cjs <outdir> <port>` | Captures 25 states: 7 viewport widths full page, 5 workflow stages, 4 detail tabs, 3 case tabs, 6 feature rows. Also reports horizontal overflow and console errors. |
| `diff.cjs [refdir] [curdir]` | Compares captures by **magnitude**: max and mean channel delta, and the share of pixels past 8/255. A differing size is reported as STRUCTURAL, which is what catches a lost layout rule. |
| `computed.cjs <refPort> <curPort>` | Compares every computed property on every element against a reference build. Stronger than the captures for stylesheet work: it names an element and a property instead of pointing at a rectangle. |
| `motion.cjs <port>` | Loads with motion **enabled** and checks every animation-name still matches a reachable `@keyframes`. Everything else runs with reduced motion and is blind to this. |
| `reveal.cjs <port>` | Counts what the scroll-reveal observer actually found. Also invisible to the others, for the same reason. |
| `states.cjs` | Exercises the four state attributes in the browser, including one in a tab that is not mounted until it is chosen. |
| `keyboard.cjs <port>` | For all three tablists: arrow keys, Home and End move selection and focus together, and tabIndex stays roving. |
| `axe.cjs <port>` | Accessibility violations at 390, 1024 and 1440. |
| `merge2.cjs <file> <servedUrl|-> [--apply]` | Merges selectors declared twice in one stylesheet. Only merges where no rule in between sets the same property, at the same specificity, on any of the same elements; the last of those is resolved against the real document. |
| `move2.cjs <ownedFile> <out> <sheets...>` | Moves the rules a section owns out of a shared stylesheet into its own module, renaming its classes and marking the rest `:global()`. Refuses to guess on a selector list that mixes owned and foreign selectors, and says so. |

## Running them

Everything expects a dev server on 5199 (`npm run dev -- --port 5199`). Checks
that compare against a reference need a second build served on another port:

```sh
git worktree add --detach .refactor/prev <ref>
cp -r node_modules .refactor/prev/ && (cd .refactor/prev && npm run build)
python3 -m http.server 5195 --directory .refactor/prev/dist &
node .refactor/computed.cjs 5195 5199
```

`.refactor/baseline` holds captures of commit 5073551, the state before the
refactor began. `diff.cjs` compares against it by default.

## Gotchas

- `playwright` is CommonJS here: `require` it, do not `import { chromium }`.
- Capture with `reducedMotion: 'reduce'` or you photograph animation frames.
- Move the mouse away (`p.mouse.move(2, 2)`) before every capture, or a hover
  left over from the previous step leaks into the next one.
- `pkill -f "http.server 5195"` matches its own command line and kills the
  shell. Write `pkill -f 'http[.]server 5195'`.
