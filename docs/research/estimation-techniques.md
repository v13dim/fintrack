# Estimation Techniques

This document describes various estimation techniques used in software development, their pros and cons, and recommendations for team size.

## Table of Contents

- [Planning Poker](#planning-poker)
- [T-shirt Sizes](#t-shirt-sizes)
- [Bucket System](#bucket-system)
- [Story Points vs Hours](#story-points-vs-hours)
- [Comparison of Approaches](#comparison-of-approaches)
- [Recommendation for Team of 5](#recommendation-for-team-of-5)

## Planning Poker

### Description

Planning Poker is a consensus-based estimation technique where team members estimate tasks using cards with numbers (typically Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21, etc.).

### Process

1. **Product Owner presents** a user story or task
2. **Team discusses** the story to clarify requirements
3. **Each team member** privately selects a card with their estimate
4. **All cards are revealed** simultaneously
5. **If estimates differ significantly**, team discusses why
6. **Process repeats** until consensus is reached

### Key Principles

- **Relative sizing**: Estimates are relative to other tasks, not absolute time
- **Team consensus**: All team members participate in estimation
- **Fibonacci sequence**: Uses non-linear scale to reflect uncertainty in larger tasks
- **Blind estimation**: Cards are revealed simultaneously to avoid anchoring bias

### Example

```
Story: "Add transaction form with validation"

Team estimates:
- Developer A: 5 points
- Developer B: 8 points
- Developer C: 5 points
- Developer D: 13 points

Discussion: Developer D explains they're considering edge cases and error handling.
Team agrees on 8 points after discussion.
```

## T-shirt Sizes

### Description

T-shirt Sizes is a simple estimation technique that uses clothing sizes (XS, S, M, L, XL, XXL) to represent task complexity.

### Size Mapping

| Size | Description | Typical Duration | Story Points Equivalent |
|------|-------------|------------------|------------------------|
| XS   | Very small task | < 2 hours | 1 point |
| S    | Small task | 2-4 hours | 2 points |
| M    | Medium task | 4-8 hours | 3-5 points |
| L    | Large task | 1-2 days | 8 points |
| XL   | Very large task | 2-5 days | 13 points |
| XXL  | Epic (needs breakdown) | > 5 days | 21+ points |

### Process

1. **Product Owner presents** a user story
2. **Team discusses** the story briefly
3. **Team assigns** a T-shirt size through discussion or voting
4. **If XXL**, story is broken down into smaller stories

### Key Principles

- **Simplicity**: Easy to understand and use
- **Visual**: Intuitive size comparison
- **Quick**: Faster than Planning Poker
- **Less precise**: Fewer granularity levels

### Example

```
Story: "Add transaction form with validation"
Team assigns: M (Medium)

Story: "Implement user authentication"
Team assigns: XL (Very Large - needs breakdown)
```

## Bucket System

### Description

Bucket System groups tasks into predefined "buckets" or categories of complexity. Tasks are placed into buckets through team discussion.

### Typical Buckets

1. **Tiny** (1 point) - Trivial tasks, < 1 hour
2. **Small** (2 points) - Simple tasks, 1-4 hours
3. **Medium** (5 points) - Moderate complexity, 1-2 days
4. **Large** (8 points) - Complex tasks, 2-3 days
5. **Extra Large** (13 points) - Very complex, 3-5 days
6. **Too Large** - Needs breakdown before estimation

### Process

1. **Team creates** reference stories for each bucket
2. **Product Owner presents** a user story
3. **Team discusses** and compares to reference stories
4. **Team places** story into appropriate bucket
5. **If "Too Large"**, story is broken down

### Key Principles

- **Reference stories**: Uses known stories as anchors
- **Grouping**: Tasks grouped by similarity
- **Fast**: Quick categorization
- **Less discussion**: Less detailed discussion than Planning Poker

### Example

```
Reference Stories:
- Tiny: "Add icon to button"
- Small: "Create simple form field"
- Medium: "Add form with validation"
- Large: "Implement authentication flow"
- Extra Large: "Build analytics dashboard"

New Story: "Add transaction form with validation"
Team compares to reference: Similar to "Add form with validation"
Bucket: Medium (5 points)
```

## Story Points vs Hours

### Story Points

**Definition**: Relative unit of measure for estimating the effort required to complete a task.

**Characteristics**:
- **Relative**: Based on comparison with other tasks
- **Abstract**: Not tied to actual time
- **Team velocity**: Team's capacity measured in points per sprint
- **Consistent**: Same task should get same points regardless of who estimates

**Advantages**:
- ✅ Accounts for complexity, uncertainty, and risk, not just time
- ✅ Works across different skill levels (junior vs senior)
- ✅ More accurate for long-term planning
- ✅ Focuses on relative sizing, not absolute time
- ✅ Less pressure on developers (no time commitments)

**Disadvantages**:
- ❌ Not intuitive for stakeholders (what is "5 points"?)
- ❌ Requires calibration period to establish velocity
- ❌ Harder to convert to deadlines for non-technical stakeholders
- ❌ Can be misused if converted to hours (defeats the purpose)

### Hours

**Definition**: Absolute time estimate in hours or days.

**Characteristics**:
- **Absolute**: Direct time measurement
- **Concrete**: Easy to understand
- **Individual**: Based on specific person's speed
- **Variable**: Same task may take different time for different people

**Advantages**:
- ✅ Easy to understand for everyone
- ✅ Direct conversion to deadlines
- ✅ No calibration needed
- ✅ Clear expectations for stakeholders

**Disadvantages**:
- ❌ Doesn't account for complexity, only time
- ❌ Varies by individual skill level
- ❌ Creates pressure and commitments
- ❌ Less accurate for long-term planning
- ❌ Encourages padding estimates (safety buffer)

### Comparison Table

| Aspect | Story Points | Hours |
|--------|--------------|-------|
| **Type** | Relative | Absolute |
| **Accuracy** | Better for long-term | Better for short-term |
| **Complexity** | Accounts for complexity | Only time-based |
| **Team Size** | Works for any size | Individual-based |
| **Stakeholder Communication** | Requires explanation | Intuitive |
| **Pressure** | Low | High |
| **Calibration** | Needed | Not needed |
| **Flexibility** | High | Low |

### When to Use Each

**Use Story Points when**:
- Long-term planning (sprints, releases)
- Team has varying skill levels
- Tasks have high uncertainty
- Focus on relative complexity
- Agile/Scrum methodology

**Use Hours when**:
- Short-term tasks (< 1 day)
- Fixed deadlines required
- Stakeholders need concrete timelines
- Individual task assignment
- Waterfall methodology

## Comparison of Approaches

### Planning Poker

**Pros**:
- ✅ Encourages team discussion and knowledge sharing
- ✅ Reduces anchoring bias (simultaneous reveal)
- ✅ Consensus-based (team ownership)
- ✅ Handles uncertainty well (Fibonacci sequence)
- ✅ Good for complex tasks
- ✅ Improves team understanding of tasks

**Cons**:
- ❌ Time-consuming (can take 1-2 hours for sprint planning)
- ❌ Requires all team members present
- ❌ Can lead to analysis paralysis
- ❌ May be overkill for simple tasks
- ❌ Requires facilitator

**Best For**:
- Teams new to estimation
- Complex projects with high uncertainty
- When team alignment is critical
- Regular sprint planning sessions

### T-shirt Sizes

**Pros**:
- ✅ Very simple and intuitive
- ✅ Fast estimation process
- ✅ Easy for non-technical stakeholders to understand
- ✅ Low overhead
- ✅ Good for quick prioritization
- ✅ Works well for high-level estimation

**Cons**:
- ❌ Less precise (only 5-6 levels)
- ❌ Less discussion (may miss important details)
- ❌ Harder to track velocity
- ❌ Less granular than story points
- ❌ May not work well for detailed planning

**Best For**:
- Quick estimation sessions
- High-level roadmap planning
- Teams new to agile
- When speed is more important than precision
- Backlog refinement

### Bucket System

**Pros**:
- ✅ Faster than Planning Poker
- ✅ Uses reference stories (consistent sizing)
- ✅ Good balance of speed and accuracy
- ✅ Less discussion overhead
- ✅ Works well for similar tasks
- ✅ Easy to learn

**Cons**:
- ❌ Requires creating and maintaining reference stories
- ❌ Less discussion than Planning Poker
- ❌ May not handle unique tasks well
- ❌ Reference stories may become outdated
- ❌ Less precise than Planning Poker

**Best For**:
- Teams with established patterns
- Similar types of tasks
- When speed is important but some precision needed
- Regular estimation with similar stories

## Recommendation for Team of 5

### Selected Approach: **Planning Poker with Story Points**

### Rationale

For a team of 5 developers, I recommend **Planning Poker with Story Points** for the following reasons:

#### 1. **Team Size is Optimal**

- 5 team members is ideal for Planning Poker
- Small enough for efficient discussion
- Large enough for diverse perspectives
- Not too large to cause chaos

#### 2. **Knowledge Sharing**

- Team members can learn from each other during estimation discussions
- Different perspectives surface risks and dependencies
- Junior developers learn from senior developers
- Cross-functional knowledge transfer

#### 3. **Consensus Building**

- Team ownership of estimates
- Reduces individual pressure
- Better commitment to estimates
- Aligned understanding of tasks

#### 4. **Handles Complexity**

- React Native projects have inherent complexity
- Integration with native modules
- State management complexity
- Database operations
- Planning Poker's discussion helps identify these complexities

#### 5. **Velocity Tracking**

- Story points enable velocity tracking
- Better sprint planning
- More accurate release planning
- Historical data for future estimates

#### 6. **Reduces Bias**

- Simultaneous card reveal prevents anchoring
- Individual estimates before discussion
- Reduces influence of dominant personalities
- More objective estimates

### Implementation Strategy

1. **Start with Reference Stories**
   - Create 2-3 reference stories for each point value (1, 2, 3, 5, 8, 13)
   - Use completed stories as future references
   - Update references as team learns

2. **Use Fibonacci Sequence**
   - 1, 2, 3, 5, 8, 13, 21
   - Reflects uncertainty in larger tasks
   - Prevents false precision

3. **Time-box Estimation Sessions**
   - 1-2 hours for sprint planning
   - 30-60 minutes for backlog refinement
   - Set time limits to avoid analysis paralysis

4. **Establish Velocity Baseline**
   - Track completed story points for 2-3 sprints
   - Calculate average velocity
   - Use for future sprint planning

5. **Regular Retrospectives on Estimation**
   - Review estimation accuracy
   - Adjust reference stories
   - Improve estimation process

### Alternative: Hybrid Approach

For certain situations, consider a **hybrid approach**:

- **Planning Poker** for sprint planning and complex stories
- **T-shirt Sizes** for quick backlog refinement
- **Bucket System** for similar, repetitive tasks

### Example Workflow

```
Sprint Planning (2 hours):
- Use Planning Poker for all sprint stories
- Deep discussion for complex stories
- Quick estimation for simple stories

Backlog Refinement (1 hour):
- Use T-shirt Sizes for initial sizing
- Convert to story points later
- Focus on clarification, not detailed estimation

Regular Estimation:
- Use Planning Poker for new stories
- Reference completed stories
- Track velocity and adjust
```

### Expected Benefits

1. **Better Estimates**: More accurate estimates through team discussion
2. **Team Alignment**: Everyone understands tasks and estimates
3. **Knowledge Sharing**: Team learns from each other
4. **Reduced Pressure**: No individual time commitments
5. **Improved Planning**: Velocity-based sprint planning
6. **Continuous Improvement**: Regular retrospectives improve process

### Challenges and Mitigations

| Challenge | Mitigation |
|-----------|------------|
| Time-consuming | Time-box sessions, use T-shirt sizes for simple tasks |
| Analysis paralysis | Set time limits, use "spike" for unknown tasks |
| Inconsistent estimates | Use reference stories, regular calibration |
| Dominant personalities | Facilitator ensures everyone speaks, blind estimation |
| Converting to deadlines | Use velocity, provide ranges, not exact dates |

## Conclusion

For a team of 5 developers working on a React Native project, **Planning Poker with Story Points** provides the best balance of accuracy, team alignment, and knowledge sharing. While it requires more time than simpler techniques, the benefits of team discussion, consensus building, and better estimates justify the investment.

The key to success is:
- Consistent application of the technique
- Regular calibration with reference stories
- Time-boxed sessions to maintain efficiency
- Continuous improvement through retrospectives

## References

- [Planning Poker - Wikipedia](https://en.wikipedia.org/wiki/Planning_poker)
- [Story Points vs Hours - Mountain Goat Software](https://www.mountaingoatsoftware.com/blog/story-points-vs-hours)
- [Agile Estimation Techniques - Atlassian](https://www.atlassian.com/agile/project-management/estimation)
- [T-shirt Sizing - Agile Alliance](https://www.agilealliance.org/glossary/t-shirt-sizing/)
