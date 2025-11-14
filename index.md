---
layout: default
title: Real-Time Embedded Systems, Design Automation & Cyber-Physical Systems
description: Interactive tracker for real-time, embedded, robotics, and CPS conferences with deadlines, venues, and tooling.
---

# Real-Time Systems, Embedded, CPS and Robitcs Conferences Tracker

![](https://badgen.net/github/stars/automaticdai/realtime-embedded-conferences) ![](https://badgen.net/github/contributors/automaticdai/realtime-embedded-conferences)


> This tracker helps researchers stay informed about upcoming deadlines and important announcements in our research community. The list is updated weekly. <br> If you find this resource helpful, please ⭐ our [GitHub repository](https://github.com/automaticdai/realtime-embedded-conferences)! <br><br> **Maintainer**: **[Dr. Steven Xiaotian Dai](http://www.xiaotiandai.com)**, Real-Time and Distributed Systems Group, University of York, UK

## Conference Dashboard

Interactively explore the conferences. Use the filters, search, and ordering controls; reset whenever you need a fresh view.

<div class="conference-dashboard" data-json="assets/data/conferences.json">
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
</div>

<script src="assets/js/conference-dashboard.js"></script>



**Date Format & Time Zones**:

- **Time Zone Notice:** Most deadlines are in AoE (Anywhere on Earth, UTC-12:00), but some conferences use local time zones. Always verify the specific time zone as deadlines approach.
- Listed deadlines are for main conference submissions; workshops, brief presentations, and industrial tracks typically have separate deadlines.

**Contributing**: This tracker thrives on community contributions! You can help by: (1) Submit an issue in the [issue list](https://github.com/automaticdai/realtime-embedded-conferences/issues); (2) Contact me through email: _xiaotian.dai (at) york.ac.uk_; (3) Fill out our [feedback form](https://forms.gle/XhDSDSr6L7GTpoEC6); or (4) Create a pull request (PR) with your changes.



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