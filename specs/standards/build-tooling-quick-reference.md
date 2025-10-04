# Build Tooling Quick Reference

## TL;DR - What Should I Use?

### Current Recommendation: Yarn Workspaces ✅

**Why?** Your 6-workspace JS monorepo doesn't need more complexity yet.

### When to Switch to Nx: 3 Triggers

1. **Size**: > 10 packages in monorepo
2. **Time**: CI builds taking > 10 minutes  
3. **Team**: > 5 developers making frequent changes

### When to Consider Bazel: Rarely

Only if Python/native code becomes > 50% of codebase AND you need hermetic builds.

## Decision Flowchart

```
Is your codebase primarily JavaScript/TypeScript?
│
├─ YES → Are you having CI/caching pain?
│         │
│         ├─ NO  → Keep Yarn Workspaces ✅
│         │
│         └─ YES → Add Nx incrementally ⏰
│
└─ NO  → Is it multi-language with strict hermetic needs?
          │
          ├─ YES → Consider Bazel (rare) 🤔
          │
          └─ NO  → Use Nx with custom executors ⏰
```

## Command Cheat Sheet

### Current Setup (Yarn Workspaces)

```bash
# Install all dependencies
yarn install

# Run in specific workspace
yarn workspace aetheros-frontend run dev
yarn workspace aetheros-auth-service run start

# Run in all workspaces
yarn workspaces foreach -pt run build
yarn workspaces foreach -pt run test

# Add dependency to workspace
yarn workspace aetheros-frontend add react-query

# Add dev dependency
yarn workspace aetheros-frontend add -D @types/node
```

### If/When You Add Nx

```bash
# Install Nx (non-destructive)
yarn add -D -W nx
npx nx init

# Run tasks (uses existing package.json scripts)
nx build aetheros-frontend
nx test aetheros-auth-service
nx lint contracts

# Run only affected by changes
nx affected --target=build
nx affected --target=test

# Visualize project graph
nx graph

# Run multiple targets
nx run-many --target=build --all
nx run-many --target=test --parallel=3

# Enable caching + cloud
npx nx connect-to-nx-cloud
```

### Python with uv (Future)

```bash
# Create new Python service
cd backend/services/ml-service
uv init
uv add langchain openai pandas

# Install dependencies
uv sync

# Run scripts
uv run python src/train.py
uv run pytest

# Add to Nx (if using)
# Define in apps/ml-service/project.json
nx run ml-service:train
```

## Performance Comparison

| Scenario | Yarn Only | Yarn + Nx | Improvement |
|----------|-----------|-----------|-------------|
| **Cold build (all)** | 3-5 min | 2-4 min | 20-30% faster |
| **Hot build (cached)** | 30-60 sec | 5-10 sec | 80-90% faster |
| **Affected only** | N/A | 30 sec | Massive win |
| **Test (cached)** | 1-2 min | 10 sec | 90% faster |
| **CI feedback** | Full build | Only changed | 50%+ faster |

## Cost Comparison

| Tool | Setup Time | License | CI Caching | Total Cost |
|------|------------|---------|------------|------------|
| **Yarn Workspaces** | 0 days | Free | None | $0/month |
| **Yarn + Nx (OSS)** | 1-2 days | Free | Local only | $0/month |
| **Yarn + Nx Cloud** | 1-2 days | Free | Remote | $0-49/month |
| **Bazel** | 4-12 weeks | Free | Remote | $0/month + 🧠 |

## Migration Effort

### Yarn → Nx (Low Risk)
- **Time**: 1-2 days
- **Risk**: Low (reversible)
- **Effort**: Add package, run `nx init`
- **Breaking Changes**: None
- **Team Training**: 2-3 hours

### Yarn → Bazel (High Risk)
- **Time**: 4-12 weeks
- **Risk**: High (rewrite)
- **Effort**: Rewrite all build configs
- **Breaking Changes**: Everything
- **Team Training**: 2-4 weeks

## Real-World Scenarios

### Scenario 1: Small Team (2-5 devs), 6 packages
**Use**: Yarn Workspaces ✅
- Simple, no overhead
- Everyone understands it
- Yarn 4.9.2 is fast enough

### Scenario 2: Growing Team (5-10 devs), 15+ packages
**Use**: Yarn + Nx ⏰
- CI times becoming painful
- Shared libraries change frequently
- Want faster feedback loops
- Nx pays for itself quickly

### Scenario 3: Heavy Python ML (50% Python, 50% JS)
**Use**: Yarn + Nx + uv 🐍
- Nx orchestrates both languages
- uv manages Python dependencies
- Unified caching and task execution
- Avoid Bazel complexity

### Scenario 4: Multi-lang with compliance (banks, aerospace)
**Use**: Bazel (rare) 🏢
- Need hermetic, reproducible builds
- Multiple languages (Go, Rust, Python, JS)
- Regulatory requirements
- Have build systems expertise

## Nx 21 Features (2024)

### New in Nx 21 Worth Knowing

1. **Terminal UI (TUI)**
   ```bash
   nx watch --all  # Beautiful interactive dashboard
   ```

2. **Continuous Tasks**
   ```bash
   nx watch --projects=app1,app2 -- nx build
   # Auto-rebuilds on file changes with dependency awareness
   ```

3. **Custom Version Actions**
   ```json
   // Support for Python, Go, etc.
   {
     "release": {
       "version": {
         "generator": "@custom/versioner"
       }
     }
   }
   ```

4. **Better Versioning**
   - Improved semantic versioning
   - Better changelog generation
   - Cross-ecosystem support

## Integration Patterns

### Pattern 1: Nx as Wrapper (Recommended Start)

Keep existing scripts, use Nx for orchestration:

```json
// package.json (no changes)
{
  "scripts": {
    "build": "tsc && webpack",
    "test": "jest"
  }
}

// Run through Nx
nx build my-app  // Calls package.json script + caching
```

### Pattern 2: Nx Native (Advanced)

Use Nx plugins for better integration:

```json
// project.json
{
  "targets": {
    "build": {
      "executor": "@nx/webpack:webpack",
      "options": { ... }
    }
  }
}
```

### Pattern 3: Hybrid (Python + JS)

Different tools per ecosystem:

```
/backend/
  ├── services/
  │   ├── auth-service/     (Node + Yarn + Nx)
  │   ├── api-gateway/      (Node + Yarn + Nx)
  │   └── ml-service/       (Python + uv + Nx)
```

## Common Pitfalls

### ❌ Don't: Adopt Bazel Too Early
- **Problem**: Team spends 3 months on tooling instead of features
- **Solution**: Use Yarn/Nx until absolutely necessary

### ❌ Don't: Over-configure Nx
- **Problem**: Trying to use every Nx feature on day 1
- **Solution**: Start simple, add caching, then grow

### ❌ Don't: Ignore Task Dependencies
- **Problem**: Builds fail because dependencies not built first
- **Solution**: Define `dependsOn` in nx.json or use Nx inference

### ❌ Don't: Cache Non-deterministic Tasks
- **Problem**: Tests that depend on current time/network get cached
- **Solution**: Mark non-deterministic tasks as `cache: false`

### ✅ Do: Start with Caching Only
- **Approach**: Add Nx, enable caching, measure impact
- **Result**: 80% of benefits with 20% of effort

### ✅ Do: Use Affected Commands
- **Approach**: `nx affected --target=build` in CI
- **Result**: Only build what changed, massive CI speedup

### ✅ Do: Measure Before/After
- **Approach**: Time CI before and after Nx adoption
- **Result**: Data-driven decision making

## Key Metrics to Track

### Before Adding Any Tool

Track these baseline metrics:
- [ ] Average CI build time
- [ ] Local build time (cold)
- [ ] Local build time (hot)
- [ ] Test suite runtime
- [ ] Developer velocity (story points/sprint)
- [ ] Number of packages/apps

### After Adding Nx

Compare:
- [ ] CI build time reduction: Target 30-50%
- [ ] Cache hit rate: Target 70-80%
- [ ] Developer satisfaction: Survey team
- [ ] Time to feedback: Target < 5 min for PR feedback

### Success Criteria for Nx Adoption

Nx is working well if:
- ✅ CI builds are 30-50% faster
- ✅ Local builds are 80-90% faster (with cache hits)
- ✅ Developers say they're more productive
- ✅ PRs get feedback in < 5 minutes

If not seeing these benefits after 2-4 weeks, reassess.

## When to Reassess

### Quarterly Build Tool Review

Every 3 months, check:
1. **Scale**: Have we crossed 10/20/50 packages?
2. **Pain**: Are builds too slow? (> 10 min CI)
3. **Languages**: Did we add Python/Go/Rust services?
4. **Team**: Did team grow significantly?
5. **Costs**: Is current approach cost-effective?

### Trigger Events

Immediate reassessment if:
- ⚠️ CI taking > 15 minutes regularly
- ⚠️ Developers waiting > 5 min for local builds
- ⚠️ Adding 3+ new packages per month
- ⚠️ Team doubles in size
- ⚠️ Adding new language ecosystem

## Getting Help

### Community Resources

**Nx:**
- Discord: https://go.nx.dev/community
- Stack Overflow: [nx] tag
- GitHub: https://github.com/nrwl/nx

**Bazel:**
- Slack: https://slack.bazel.build/
- Stack Overflow: [bazel] tag
- GitHub: https://github.com/bazelbuild/bazel

**Yarn:**
- Discord: https://discord.com/invite/yarnpkg
- Stack Overflow: [yarn] tag
- GitHub: https://github.com/yarnpkg/berry

**uv:**
- Discord: https://discord.gg/astral-sh
- GitHub: https://github.com/astral-sh/uv

## Summary Card

```
┌─────────────────────────────────────────────────────────┐
│  AetherOS Build Tooling Decision Card                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  TODAY (6 packages, JS-first):                          │
│  ✅ Yarn 4.9.2 Workspaces                               │
│                                                          │
│  WHEN SCALING (10+ packages, 5+ devs):                  │
│  ⏰ Add Nx incrementally                                │
│                                                          │
│  WITH PYTHON (ML services):                             │
│  🐍 uv + Nx custom executors                            │
│                                                          │
│  AVOID (unless requirements change):                    │
│  ❌ Bazel (too complex for current scale)               │
│                                                          │
│  NEXT REVIEW: Q1 2025                                   │
│  ⏰ Check: package count, CI time, team size            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## See Also

- [Full Build Tooling Recommendations](./build-tooling-recommendations.md) - Detailed analysis
- [Tech Stack Standards](./tech-stack.md) - Technology choices
- [Setup Guide](../setup-guide.md) - Getting started

---

**Last Updated**: 2024 Q4  
**Next Review**: Check quarterly or when crossing trigger thresholds
