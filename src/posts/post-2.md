---
title: "Deploying to Prod on Fridays"
date: "2026-03-12"
tags: ["DEVOPS", "PIPELINES"]
slug: "post-2"
---
"Don't deploy on Friday" is the battle cry of engineers who don't trust their own infrastructure. If you are terrified of a push breaking the application right before the weekend, you have an engineering problem, not a scheduling problem.

<h3 style="margin-top: var(--space-32); margin-bottom: var(--space-16);">FEAR OF THE UNKNOWN</h3>
I hear it all the time from consulting clients. They restrict merges from Thursday afternoon to Monday morning. 72 hours of halted delivery. Why? When you are managing <a href="wordpress-nightmare.html">fragile WordPress deployments</a>, this fear makes sense. WordPress updates can break plugins, themes, and entire databases unexpectedly. But when you build pure static websites, this fear vanishes entirely.

<div class="brut-table-wrapper" style="margin-top: var(--space-16); margin-bottom: var(--space-24);">
  <table class="brut-table">
    <thead>
      <tr>
        <th>EXCUSE</th>
        <th>REAL CAUSE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>"No one is around to monitor it"</td>
        <td>You don't have automated alerting.</td>
      </tr>
      <tr>
        <td>"It takes too long to rollback"</td>
        <td>Your rollback procedure requires manual DB intervention (like in WordPress).</td>
      </tr>
      <tr>
        <td>"We always catch bugs in prod"</td>
        <td>Your staging environment doesn't mirror prod data.</td>
      </tr>
    </tbody>
  </table>
</div>

The Brutalist approach to CI/CD is strict, structural, and unforgiving. Your <a href="https://martinfowler.com/bliki/DeploymentPipeline.html" target="_blank" rel="noopener">deployment pipeline</a> should enforce quality like a brick wall. Website design shouldn't just be about how the frontend looks; true website design encompasses the entire structural delivery mechanism. When you decouple the frontend and serve static websites, your deployment pipeline becomes infinitely more reliable.

<div class="brut-card" style="margin-top: var(--space-32);">
  <div class="brut-card-header">
    <h3>THE PROTOCOL</h3>
  </div>
  <ol style="margin-left: var(--space-24); font-family: var(--font-mono); font-size: 1rem;">
    <li style="margin-bottom: var(--space-8);"><strong>Automated Rollbacks:</strong> If the health check fails for 30 seconds post-deploy, the container orchestration immediately orchestrates a revert to the previous hash. With static websites, a rollback is just pointing traffic to the previous build bucket.</li>
    <li style="margin-bottom: var(--space-8);"><strong>Feature Flags:</strong> You aren't shipping code on Friday. You're shipping dead code on Friday, and flipping a switch in a managed UI on Monday. This goes far beyond generic website design tactics.</li>
    <li style="margin-bottom: var(--space-8);"><strong>Aggressive Testing:</strong> E2E tests must pass. Not 99% of them. 100%. If a single flaky test fails, the build stops. Fix the test or revert the PR. Stop relying on manual testing of WordPress admin panels.</li>
  </ol>
</div>

<p style="margin-top: var(--space-32);">I deployed this site on a Friday at 11:30 PM. I went to sleep. Nothing burned down. Trust the system. Drop the monolithic servers, embrace <a href="static-security.html">static websites</a>, and ship fearlessly.</p>
