const React = await import('react');

export function Objectives() {
  return (
    <>
      <h2 className="info-header">Objectives</h2>

      <div className="info-container">
        <div className="content">
          <p>
            e objective of the game is to gain as many spaces as possible on the board.Teams ut into
            divisions according to their advantages at the start of the game and should aim to gain
            more spaces than any other team in their division in all classes.
          </p>

          <div className="flex">
            <div>
              <strong>Division 1</strong>
              <span>France</span>
              <span>Britain</span>
            </div>

            <div>
              <strong>Division 2</strong>
              <span>Mohawk</span>
              <span>Shawnee</span>
              <span>Miami</span>
            </div>

            <div>
              <strong>Division 3</strong>
              <span>Ojibwe</span>
              <span>Cherokee</span>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Rules() {
  return (
    <>
      <h2 className="info-header">Rules</h2>

      <div className="info-container">
        <ol className="content">
          <li>You can only attack a space that is connected to one you control.</li>
          <li>Alliances can be broken by either party at any time.</li>
          <li>
            If you win a battle as the aggressor, you gain the space you attacked.Your turn
            continues and you may attack another space until you win three spaces, pass, or lose.
          </li>
          <li>If you lose a battle, you subtract one from your roll number.</li>
          <li>
            If you are being attacked, you may forfeit the space to the attacker, which allows you
            to keep your roll number the same.
          </li>
          <li>
            If an alliance loses a battle, every member of the alliance loses one from their roll
            number.
          </li>
          <li>
            e minimum roll number for Britain and France is 12. The minimum roll number for all
            other groups is 6.
          </li>
          <li>In the event of a tie, both sides roll again.</li>
          <li>You cannot lose your last space until there is only one round left in the game.</li>
        </ol>
      </div>
    </>
  );
}
