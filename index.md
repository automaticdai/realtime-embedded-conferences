---
layout: default
title: Real-Time, Embedded Systems, Design Automation, CPS & Robotics Conferences
description: Interactive tracker for real-time, embedded, robotics, and CPS conferences with deadlines, venues, and tooling.
---

<div class="lede">
  <p class="eyebrow">Community deadline tracker &middot; Updated weekly</p>
  <h1>Real-Time, Embedded, CPS &amp; Robotics Conferences</h1>
  <p class="lede__text">Every submission deadline our community needs to keep, in one list &mdash; with the venue, the dates, and whether the call has actually been published yet.</p>
  <p class="lede__meta">Maintained by <a href="http://www.xiaotiandai.com">Dr Steven Xiaotian Dai</a>, Real-Time and Distributed Systems Group, University of York. Corrections are welcome &mdash; <a href="https://github.com/automaticdai/realtime-embedded-conferences/issues">open an issue</a> or <a href="https://github.com/automaticdai/realtime-embedded-conferences">star the repository</a>.</p>
  <p class="lede__badges">
    <img src="https://badgen.net/github/stars/automaticdai/realtime-embedded-conferences" alt="GitHub stars" />
    <img src="https://badgen.net/github/contributors/automaticdai/realtime-embedded-conferences" alt="GitHub contributors" />
  </p>
</div>

<section class="horizon" data-role="horizon" aria-labelledby="horizon-title">
  <div class="section-head">
    <h2 class="section-title" id="horizon-title">Timeline View (Deadlines)</h2>
    <p class="section-note" data-role="horizon-note">Every open call, in deadline order.</p>
  </div>
  <ul class="horizon__counts" data-role="horizon-counts"></ul>
  <div class="horizon__plot" data-role="horizon-plot"></div>
</section>

<section class="conference-dashboard" data-json="assets/data/conferences.json" aria-labelledby="all-title">
  <div class="section-head">
    <h2 class="section-title" id="all-title">Detailed List</h2>
    <p class="section-note">Filter, search and sort the full list.</p>
  </div>

  <div class="toolbar">
    <div data-role="summary">Loading conferences…</div>
    <div class="actions">
      <button type="button" data-filter="sort-order">Ascending ↑</button>
      <button type="button" data-action="reset">Reset filters</button>
    </div>
  </div>

  <div class="filters">
    <label>Status
      <select data-filter="status"></select>
    </label>
    <label>Type
      <select data-filter="type"></select>
    </label>
    <label>Category
      <select data-filter="category"></select>
    </label>
    <label>Sort by
      <select data-filter="sort"></select>
    </label>
    <label>Search
      <input type="search" data-filter="search" placeholder="venue, city, remark…" />
    </label>
  </div>

  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Type</th>
          <th>Category</th>
          <th>Where</th>
          <th>When</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <noscript>Enable JavaScript to use the interactive dashboard. You can still read the quick snapshots in <code>README.md</code> or inspect <code>assets/data/conferences.json</code>.</noscript>
</section>

<script src="assets/js/conference-dashboard.js"></script>



#### Reading the dates

- Most deadlines are AoE (Anywhere on Earth, UTC-12:00), but some conferences use a local time zone. Verify the time zone as a deadline approaches.
- Listed deadlines are for main-conference submissions. Workshops, brief presentations and industrial tracks usually have their own.
- A deadline marked *(approx.)* is predicted from the previous edition; the call for papers has not been published yet.

#### Contributing

This tracker runs on community corrections. [Open an issue](https://github.com/automaticdai/realtime-embedded-conferences/issues), send a pull request, fill in the [feedback form](https://forms.gle/XhDSDSr6L7GTpoEC6), or email _xiaotian.dai (at) york.ac.uk_.



## Journal List

#### Top journals for Real-Time Systems, Embedded Systems, Design Automation, and Parallel Computing

| Name                                                         | Publisher |
| ------------------------------------------------------------ | --------- |
| [ACM Transactions on Embedded Computing Systems (TECS)](https://dl.acm.org/journal/tecs) | ACM       |
| [ACM Transactions on Computer Systems (TOCS)](https://dl.acm.org/journal/tocs) | ACM       |
| [ACM Transactions on Parallel Computing (TOPC)](https://dl.acm.org/journal/topc) | ACM       |
| [ACM Transactions on Cyber-Physical Systems (TCPS)](https://dl.acm.org/journal/tcps) | ACM       |
| [ACM Transactions on Modeling and Computer Simulation (TOMACS)](https://tomacs.acm.org) | ACM       |
| [ACM Transactions on Design Automation of Electronic Systems (TODAES)](https://todaes.acm.org) | ACM       |
| [ACM Journal on Emerging Technologies in Computing Systems (JETC)](https://jetc.acm.org) | ACM       |
| [ACM Transactions on Internet of Things (TIOT)](https://tiot.acm.org) | ACM       |
| [ACM Transactions on Sensor Networks (TOSN)](https://tosn.acm.org) | ACM       |
| [Formal Aspects of Computing: Applicable Formal Methods (FAC)](https://fac.acm.org) | ACM       |
| [IEEE Transactions on Computers (TC)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=12) | IEEE      |
| [IEEE Transactions on Computer-Aided Design of Integrated Circuits And System (TCAD)](https://ieee-ceda.org/publication/ieee-transactions-computer-aided-design-integrated-circuits-systems-tcad) | IEEE      |
| [IEEE Transactions on Parallel and Distributed Systems (TPDS)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=71) | IEEE      |
| [IEEE Embedded Systems Letters (ESL)](https://ieee-ceda.org/publication/ieee-embedded-systems-letters-esl) | IEEE      |
| [Microprocessors and Microsystems (MICPRO)](https://www.journals.elsevier.com/microprocessors-and-microsystems) | Elsevier  |
| [Journal of Systems Architecture (JSA)](https://www.journals.elsevier.com/journal-of-systems-architecture) | Elsevier  |
| [Real-Time Systems Journal (RTSJ)](https://www.springer.com/journal/11241) | Springer  |

#### Top journals for Robotics, Control, Vision and Learning

| Name                                                                                                               | Publisher |
| ------------------------------------------------------------------------------------------------------------------ | --------- |
| [ACM Transactions on Human-Robot Interaction (THRI)](https://dl.acm.org/journal/thri)                              | ACM       |
| [IEEE Transactions on Robotics (TRO)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860)               | IEEE      |
| [IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34) | IEEE      |
| [IEEE Robotics and Automation Letters (RA-L)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7083369)    | IEEE      |
| [IEEE Robotics and Automation Magazine (RAM)](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=100)        | IEEE      |
| [Robotics and Autonomous Systems (RAS)](https://www.sciencedirect.com/journal/robotics-and-autonomous-systems)     | Elsevier  |
| [Journal of Intelligent and Robotic Systems (JINT)](https://www.springer.com/journal/10846)                        | Springer  |
| [International Journal of Computer Vision (IJCV)](https://www.springer.com/journal/11263)                          | Springer  |
| [International Journal of Robotics Research (IJRR)](https://journals.sagepub.com/home/ijr)                         | SAGE      |
| [Journal of Machine Learning Research (JMLR)](http://www.jmlr.org/)                                                | Microtome |
| [Journal of Field Robotics (JFR)](https://onlinelibrary.wiley.com/journal/15564967)                                | Wiley     |


---

## 🔗Useful Links

- [IEEE TCRTS](https://site.ieee.org/tcrts/)
- [ACM SIGBED](https://www.sigbed.org/)
- [ACM SIGBED Blog](https://sigbed.org/blog/)
- [ACM SIGDA](https://www.sigda.org/)
- [Conference Ranks](http://www.conferenceranks.com/)
- [Scimago Journal & Country Rank](https://www.scimagojr.com/)
- [An Incomplete List of Conferences in Computer Science](https://www.conferences-computer.science/)

-------

{% include counter.html %}
