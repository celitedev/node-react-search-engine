import React from 'react';
import PureComponent from 'react-pure-render/component';
import { page } from '../page';
import { setMeta } from '../../actions';

@page('Privacy')
export default class Privacy extends PureComponent {

  static fetchData({ dispatch }) {
    dispatch(setMeta({
      title: 'Privacy Policy | TutorMe'
    }));
    return Promise.resolve({});
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.containerResponsive}>
          <div className={styles.row}>
            <div className={styles.content}>
              <h3 className={styles.companyName}>TutorMe.com, Inc</h3>
              <h1 className={styles.title}>Privacy policy</h1>

              <ol className={styles.nestedList}>

                <li><strong>Introduction</strong>
                  <ol>
                    <li>We are committed to safeguarding the privacy of our website visitors; in this policy we
                      explain how we
                      will
                      treat your personal information.
                    </li>
                    <li>We will ask you to consent to our use of cookies in accordance with the terms of this policy
                      when you
                      first
                      visit our website. / By using our website and agreeing to this policy, you consent to our use
                      of cookies
                      in
                      accordance with the terms of this policy.
                    </li>
                  </ol>
                </li>

                <li><strong>Collecting personal information</strong>
                  <ol>
                    <li>We may collect, store and use the following kinds of personal information:
                      <ol type='a'>
                        <li>information about your computer and about your visits to and use of this website
                          including your IP
                          address, geographical location, browser type and version, operating system, referral
                          source, length
                          of visit, page views and website navigation paths;
                        </li>
                        <li>information that you provide to us when registering with our website including your
                          Facebook
                          profile;
                        </li>
                        <li>information that you provide when completing your profile on our website including your
                          email
                          address, full name, university, field of study, degree, graduation year, industry, job
                          title,
                          biography, teaching experience, work history, educational history, and subject expertise;
                        </li>
                        <li>information that you provide to us for the purpose of subscribing to our email
                          notifications
                          and/or newsletters including your name and email address;
                        </li>
                        <li>information that you provide to us when using the services on our website, or that is
                          generated in
                          the course of the use of those services including the timing, frequency and pattern of
                          service use;
                        </li>
                        <li>information that you post to our website for publication on the internet including your
                          user name,
                          your profile picture and the content of your question answers and posts;
                        </li>
                        <li>information contained in or relating to any communication that you send to us or send
                          through our
                          website including the communication content and metadata associated with the
                          communication;
                        </li>
                        <li>any other personal information that you choose to send to us;</li>
                      </ol>
                    </li>
                    <li>Before you disclose to us the personal information of another person, you must obtain that
                      person's
                      consent to both the disclosure and the processing of that personal information in accordance
                      with this
                      policy.
                    </li>
                  </ol>
                </li>


                <li><strong>Using personal information</strong>
                  <ol>
                    <li>Personal information submitted to us through our website will be used for the purposes
                      specified in
                      this policy or on the relevant pages of the website.
                    </li>
                    <li>We may use your personal information to:
                      <ol type='a'>
                        <li>administer our website and business;</li>
                        <li>personalise our website for you;</li>
                        <li>enable your use of the services available on our website;</li>
                        <li>supply to you services purchased through our website;</li>
                        <li>send statements, invoices and payment reminders to you, and collect payments from you;
                        </li>
                        <li>send you non-marketing commercial communications;</li>
                        <li>send you email notifications that you have specifically requested;</li>
                        <li>send you our email newsletter, if you have requested it (you can inform us at any time
                          if you no
                          longer require the newsletter);
                        </li>
                        <li>send you marketing communications relating to our business [or the businesses of
                          carefully-selected third parties] which we think may be of interest to you, by post or,
                          where you
                          have specifically agreed to this, by email or similar technology (you can inform us at any
                          time if
                          you no longer require marketing communications);
                        </li>
                        <li>provide third parties with statistical information about our users (but those third
                          parties will
                          not be able to identify any individual user from that information);
                        </li>
                        <li>deal with enquiries and complaints made by or about you relating to our website;</li>
                        <li>keep our website secure and prevent fraud;</li>
                        <li>verify compliance with the terms and conditions governing the use of our website
                          (including
                          monitoring private messages sent through our website private messaging service);
                        </li>

                      </ol>
                    </li>
                    <li>If you submit personal information for publication on our website, we will publish and
                      otherwise use
                      that information in accordance with the licence you grant to us.
                    </li>
                    <li>Your privacy settings can be used to limit the publication of your information on our
                      website, and can
                      be adjusted using privacy controls on the website.
                    </li>
                    <li>We will not, without your express consent, supply your personal information to any third
                      party for the
                      purpose of their or any other third party's direct marketing.
                    </li>
                    <li>All our website financial transactions are handled through our payment services provider,
                      Stripe. You
                      can review the provider's privacy policy at <a href='https://stripe.com/us/terms'>https://stripe.com/us/terms</a>.
                      We will share information with
                      our payment services provider only to the extent necessary for the purposes of processing
                      payments you
                      make via our website, refunding such payments and dealing with complaints and queries relating
                      to such
                      payments and refunds.
                    </li>
                  </ol>
                </li>


                <li><strong>Disclosing personal information</strong>
                  <ol>
                    <li>We may disclose your personal information to any of our employees, officers, insurers,
                      professional
                      advisers, agents, suppliers or subcontractors insofar as reasonably necessary for the purposes
                      set out
                      in this policy.
                    </li>
                    <li>We may disclose your personal information to any member of our group of companies (this
                      means our
                      subsidiaries, our ultimate holding company and all its subsidiaries) insofar as reasonably
                      necessary for
                      the purposes set out in this policy.
                    </li>
                    <li>We may disclose your personal information:
                      <ol type='a'>
                        <li>to the extent that we are required to do so by law;</li>
                        <li>in connection with any ongoing or prospective legal proceedings;</li>
                        <li>in order to establish, exercise or defend our legal rights (including providing
                          information to
                          others for the purposes of fraud prevention and reducing credit risk);
                        </li>
                        <li>to the purchaser (or prospective purchaser) of any business or asset that we are (or are
                          contemplating) selling;
                        </li>
                        <li>to any person who we reasonably believe may apply to a court or other competent
                          authority for
                          disclosure of that personal information where, in our reasonable opinion, such court or
                          authority
                          would be reasonably likely to order disclosure of that personal information.
                        </li>
                      </ol>
                    </li>
                    <li>Except as provided in this policy, we will not provide your personal information to third
                      parties.
                    </li>
                  </ol>
                </li>

                <li><strong>International data transfers</strong>
                  <ol>
                    <li>Information that we collect may be stored and processed in and transferred between any of
                      the
                      countries in which we operate in order to enable us to use the information in accordance with
                      this
                      policy.
                    </li>
                    <li>Information that we collect may be transferred to the following countries which do not have
                      data
                      protection laws equivalent to those in force in the European Economic Area: the United States
                      of
                      America, Russia, Japan, China and India.
                    </li>
                    <li>Personal information that you publish on our website or submit for publication on our
                      website may be
                      available, via the internet, around the world. We cannot prevent the use or misuse of such
                      information
                      by others.
                    </li>
                    <li>You expressly agree to the transfers of personal information described in this Section 6.
                    </li>
                  </ol>
                </li>

                <li><strong>Retaining personal information</strong>
                  <ol>
                    <li>This Section 7 sets out our data retention policies and procedure, which are designed to
                      help ensure
                      that we comply with our legal obligations in relation to the retention and deletion of
                      personal
                      information.
                    </li>
                    <li>Notwithstanding the other provisions of this Section 7, we will retain documents (including
                      electronic
                      documents) containing personal data:
                      <ol type='a'>
                        <li>to the extent that we are required to do so by law;</li>
                        <li>if we believe that the documents may be relevant to any ongoing or prospective legal
                          proceedings;
                          and
                        </li>
                        <li>in order to establish, exercise or defend our legal rights (including providing
                          information to
                          others for the purposes of fraud prevention and reducing credit risk).
                        </li>
                      </ol>
                    </li>
                  </ol>
                </li>

                <li><strong>Security of personal information</strong>
                  <ol>
                    <li>We will take reasonable technical and organisational precautions to prevent the loss, misuse
                      or
                      alteration of your personal information.
                    </li>
                    <li>We will store all the personal information you provide on our secure (password- and
                      firewall-protected) servers.
                    </li>
                    <li>All electronic financial transactions entered into through our website will be protected by
                      encryption
                      technology.
                    </li>
                    <li>You acknowledge that the transmission of information over the internet is inherently
                      insecure, and we
                      cannot guarantee the security of data sent over the internet.
                    </li>
                    <li>You are responsible for keeping the password you use for accessing our website confidential;
                      we will
                      not ask you for your password (except when you log in to our website).
                    </li>
                  </ol>
                </li>

                <li><strong>Amendments</strong>
                  <ol>
                    <li>We may update this policy from time to time by publishing a new version on our website.</li>
                    <li>You should check this page occasionally to ensure you are happy with any changes to this
                      policy.
                    </li>
                    <li>We may notify you of changes to this policy</li>
                  </ol>
                </li>


                <li><strong>Your rights</strong>
                  <ol>
                    <li>You may instruct us to provide you with any personal information we hold about you;
                      provision of such
                      information will be subject to:
                      <ol type='a'>
                        <li>the supply of appropriate evidence of your identity (for this purpose, we will usually
                          accept a
                          photocopy of a government issued ID).
                        </li>
                      </ol>
                    </li>
                    <li>We may withhold personal information that you request to the extent permitted by law.</li>
                    <li>You may instruct us at any time not to process your personal information for marketing
                      purposes.
                    </li>
                    <li>In practice, you will usually either expressly agree in advance to our use of your personal
                      information for marketing purposes, or we will provide you with an opportunity to opt out of
                      the use of
                      your personal information for marketing purposes.
                    </li>
                  </ol>
                </li>

                <li><strong>Third party websites</strong>
                  <ol>
                    <li>Our website includes hyperlinks to, and details of, third party websites.</li>
                    <li>We have no control over, and are not responsible for, the privacy policies and practices of
                      third
                      parties.
                    </li>
                  </ol>
                </li>

                <li><strong>Updating information</strong>
                  <ol>
                    <li>Please let us know if the personal information that we hold about you needs to be corrected
                      or
                      updated.
                    </li>
                  </ol>
                </li>

                <li><strong>Cookies</strong>
                  <ol>
                    <li>Our website uses cookies.</li>
                    <li>A cookie is a file containing an identifier (a string of letters and numbers) that is sent
                      by a web
                      server to a web browser and is stored by the browser. The identifier is then sent back to the
                      server
                      each time the browser requests a page from the server.
                    </li>
                    <li>Cookies may be either "persistent" cookies or "session" cookies: a persistent cookie will be
                      stored by
                      a web browser and will remain valid until its set expiry date, unless deleted by the user
                      before the
                      expiry date; a session cookie, on the other hand, will expire at the end of the user session,
                      when the
                      web browser is closed.
                    </li>
                    <li>Cookies do not typically contain any information that personally identifies a user, but
                      personal
                      information that we store about you may be linked to the information stored in and obtained
                      from
                      cookies.
                    </li>
                    <li>We use both session and persistent cookies on our website.</li>
                    <li>The purposes for which cookies are used, are set out below:
                      <ol type='a'>
                        <li>we use cookies on our website to recognise a computer when a user visits the website,
                          improve the
                          website's usabilitym, administer the website, prevent fraud and improve the security of
                          the website,
                          personalise the website for each user;
                        </li>
                      </ol>
                    </li>
                    <li>Most browsers allow you to refuse to accept cookies; for example:
                      <ol type='a'>
                        <li>in Internet Explorer (version 11) you can block cookies using the cookie handling
                          override
                          settings available by clicking "Tools", "Internet Options", "Privacy" and then "Advanced";
                        </li>
                        <li>in Firefox (version 39) you can block all cookies by clicking "Tools", "Options",
                          "Privacy",
                          selecting "Use custom settings for history" from the drop-down menu, and unticking "Accept
                          cookies
                          from sites"; and
                        </li>
                        <li>in Chrome (version 44), you can block all cookies by accessing the "Customise and
                          control" menu,
                          and clicking "Settings", "Show advanced settings" and "Content settings", and then
                          selecting "Block
                          sites from setting any data" under the "Cookies" heading.
                        </li>
                      </ol>
                    </li>
                    <li>Blocking all cookies will have a negative impact upon the usability of many websites.</li>
                    <li>If you block cookies, you will not be able to use all the features on our website.</li>
                    <li>You can delete cookies already stored on your computer; for example:
                      <ol type='a'>
                        <li>in Internet Explorer (version 11), you must manually delete cookie files (you can find
                          instructions for doing so at <a
                            href='http://windows.microsoft.com/en-gb/internet-explorer/delete-manage-cookies#ie=ie-11'>http://windows.microsoft.com/en-gb/internet-explorer/delete-manage-cookies#ie=ie-11</a>);
                        </li>
                        <li>in Firefox (version 39), you can delete cookies by clicking "Tools", "Options" and
                          "Privacy", then
                          selecting "Use custom settings for history" from the drop-down menu, clicking "Show
                          Cookies", and
                          then clicking "Remove All Cookies"; and
                        </li>
                        <li>in Chrome (version 44), you can delete all cookies by accessing the "Customise and
                          control" menu,
                          and clicking "Settings", "Show advanced settings" and "Clear browsing data", and then
                          selecting
                          "Cookies and other site and plug-in data" before clicking "Clear browsing data".
                        </li>
                      </ol>
                    </li>
                    <li>Deleting cookies will have a negative impact on the usability of many websites.</li>
                  </ol>
                </li>

                <li><strong>Our details</strong>
                  <ol>
                    <li>This website is owned and operated by TutorMe.com, Inc.</li>
                    <li>We are a California corporation at 1829 Stearns Dr. Los Angeles, CA 90035</li>
                    <li>You can contact us by writing to the business address given above, by using our website
                      contact form,
                      or by email to <a href='mailto:support@tutorme.com'>support@tutorme.com</a>
                    </li>
                  </ol>
                </li>

              </ol>

            </div>
          </div>
        </div>

      </div>
    );
  }

}
