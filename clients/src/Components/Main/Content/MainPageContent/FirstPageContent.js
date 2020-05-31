import React, { Component } from 'react';
export class ContentOne extends Component {
  render() {
    let content = (
      <div className="one">
        <h2>What is <span className="red">vaping</span>?</h2>
        <p>Vaping is the act of inhaling and exhaling the aerosol produced by an e-cigarette or similar device.
          The liquid is heated into a vapor, which the person inhales. That's why using e-cigarettes is called 'vaping'.
          A majority of smokers turn to this method to transition from smoking cigarettes to not smoking at all.
          However, vaping has had a massive upward trend amongst teens recently.
        </p>
      </div>
    );
    return content;
  }
}

export class ContentTwo extends Component {
  render() {
    let content = (
      <div className="two">
        <h2>COMMONLY USED VAPING DEVICES</h2>
        <div className="cards">
          <ol>
            <div className="row">
              <div className="column">
                <a href="https://www.juul.com/" aria-label="Go to Juul's Home page">
                <img src={"images/juulhq.jpeg"} alt="juul" />
                <div className="card">
                  <li>JUUL</li>
                </div>
              </a>
              </div>
              <div className="column">
                <a href="https://www.suorinusa.com/" aria-label="Go to suorin's home page">
                <img src="images/sourin.jpeg" alt="suorin" />
                <div className="card">
                  <li>SUORIN</li>
                </div>
              </a>
              </div>
              <div className="column">
                <a href="https://puffbar.com/" aria-label="Go to puffbar's Home page">
                <img src="images/pbar.jpg" alt="puffbar" />
                <div className="card">
                  <li>PUFFBAR</li>
                </div>
              </a>
              </div>
            </div>
            <p>More information about the different vape brands can be found <a href="https://en.wikipedia.org/wiki/List_of_electronic_cigarette_and_e-cigarette_liquid_brands#J" aria-label="Go to page about e-cigs">here.</a></p>
          </ol>
        </div>
      </div>
    );
    return content;
  }
}

export class ContentThree extends Component {
  render() {
    let content = (
      <div className="three">
        <h2><span className="red">DANGERS</span> OF VAPING</h2>
        <p>
          E-cigarettes are now the <a href="https://www.drugabuse.gov/drugs-abuse/tobacconicotine-vaping">most frequently</a>
          used tobacco product among adolescents — <a href="https://www.fda.gov/TobaccoProducts/PublicHealthEducation/ProtectingKidsfromTobacco/ucm405173.htm">
          some 2.1 million</a> middle and high school students were e-cigarette users in 2017 — far surpassing traditional combustible cigarettes. One reason
          for this could involve the misinformation spread among teens that vaping is a much better and safer alternative than
          smoking traditional cigarettes. The <a href="https://www.fda.gov/NewsEvents/Newsroom/PressAnnouncements/ucm620184.htm">FDA</a> announced that it will be closely monitoring the 'kid-friendly marketing and
          appeal of these products' because “we see clear signs that youth use of electronic cigarettes has reached an epidemic
          proportion.” And after recent unexplained illnesses and deaths that have been attributed to vaping, the CDC and the
          American Medical Association are recommending that people should avoid vaping entirely.
        </p>
      </div>
    );
    return content;
  }
}

export class ContentFour extends Component {
  render() {
    let content = (
      <div>
        <div className="box">
          <div className="picture">
            <img src="images/thinking.png" alt="person thinking" />
          </div>
          <div className="text">
            <h4>RISKS TO THE <span className="red">BRAIN</span></h4>
            <p>The part of the brain that's responsible for decision making and impulse control is not yet fully developed during adolescence. Young people are more likely to take risks with their health and safety, including use of nicotine and other drugs. Youth and young adults are also uniquely at risk for long-term, long-lasting effects of exposing their developing brains to nicotine. These risks include nicotine addiction, mood disorders, and permanent lowering of impulse control. Nicotine also changes the way synapses are formed, which can harm the parts of the brain that control attention and learning.</p>
          </div>
        </div>
        <div className="box">
          <div className="picture">
            <img src="images/young_people.png" alt="two young people" />
          </div>
          <div className="text">
            <h4>HOW <span className="red">NICOTINE</span> AFFECTS THE <span className="red">BRAIN</span></h4>
            <p>How does the nicotine in e-cigarettes affect the brain? Until about age 25, the brain is still growing. Each time a new memory is created or a new skill is learned, stronger connections – or synapses – are built between brain cells. Young people's brains build synapses faster than adult brains. Because addiction is a form of learning, adolescents can get addicted more easily than adults. The nicotine in e-cigarettes and other tobacco products can also prime the adolescent brain for addiction to other drugs such as cocaine.</p>
          </div>
        </div>
        <div className="box">
          <div className="picture">
            <img src="images/choice.png" alt="person making a choice" />
          </div>
          <div className="text">
            <h4>"BUT IT'S NOT <span className="red">CIGARETTES</span>"</h4>
            <p>Some people have suggested that use of e-cigarettes by young people might "protect" them from using cigarettes. There is no evidence to support this claim. Some studies show that non-smoking youth who use e-cigarettes are more likely to try conventional cigarettes in the future than non-smoking youth who do not use e-cigarettes. And among high school students and young adults who use two or more tobacco products, a majority use both e-cigarettes and burned tobacco products. Burned tobacco products like cigarettes are responsible for the overwhelming majority of tobacco-related deaths and disease in the United States.</p>
          </div>
        </div>
        <div className="box">
          <div className="picture">
            <img src="images/doctors.png" alt="picture of two doctors" />
          </div>
          <div className="text">
            <h4>E-CIGARETTES CONTAIN <span className="red">AEROSOLS</span></h4>
            <p>The aerosol from e-cigarettes is can contain harmful and potentially harmful chemicals, including nicotine; ultrafine particles that can be inhaled deep into the lungs; flavoring such diacetyl, a chemical linked to a serious lung disease; volatile organic compounds such as benzene, which is found in car exhaust; and heavy metals, such as nickel, tin, and lead. Scientists are still working to understand more fully the health effects and harmful doses of e-cigarette contents when they are heated and turned into an aerosol, both for active users who inhale from a device and for those who are exposed to the aerosol secondhand. </p>
          </div>
        </div>
      </div>
    );
    return content;
  }
}

export class ContentFive extends Component {
  render() {
    let content = (
      <div>
        <p> *Most of the data above is taken from <a href="https://e-cigarettes.surgeongeneral.gov/knowtherisks.html"> here</a></p>
        <div className="four">
          <div className="line"></div>
          <blockquote>"It made me look cool and tasted just like mango." <span>- Anonymous user</span></blockquote>
          <blockquote>"I don't feel like starting my day without it." <span>- Anonymous user</span></blockquote>
          <h1>That's how I feel!</h1>
          <h2>Yeah, we <span className="red">know</span>.</h2>
          <img src="images/read_posts.png" alt="person reading online posts" className="center" />
          <p>Read posts like this where users from around the world talk about their vaping addiction in a separate section. Feel free to like some of these posts as well so that we can help you overcome your addiction better!</p>
          <div className="btn">
            <a href="/others">GO THERE</a>
          </div>
        </div>
      </div>
    );
    return content;
  }
}

export class OurMission extends Component {
  render() {
    let mission = (
      <div className="mission">
        <h2><span className="vapemission">OUR MISSION</span></h2>
        <p>
        Quitting nicotine is hard, especially when you lack support. Groups like Alcoholics Anonymous exist for people with 
        alcoholism, but there aren’t very many groups for people addicted to nicotine products, such as vaping or smoking. 
        There are also people who don’t know where to start with the whole process of quitting, or need reliable resources 
        on how to quit. Through Eradicate the Vape, we wish to connect people across all stages of recovery, from those who 
        haven’t started to those who’ve crossed the finish line. Through our forums service and personalized goals, we hope 
        to provide support, connections, and resources to everyone on their journey to quit nicotine once and for all. 
        </p>
      </div>
    );
    return mission;
  }
}
export default ContentOne;