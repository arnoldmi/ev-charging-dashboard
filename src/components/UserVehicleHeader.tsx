import React from 'react';

interface UserVehicleHeaderProps {
  userName: string;
  vehicleModel: string;
  vehicleColor: string;
}

const UserVehicleHeader: React.FC<UserVehicleHeaderProps> = ({ userName, vehicleModel, vehicleColor }) => {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #9b84ad'
    }}>
      <div style={{ marginRight: '20px' }}>
        <img
          src="https://media.vw.mediaservice.avp.tech/media/fast/v3_02TT4gTVxzHn9_sanE3CZmsGd2d7maDM9RJspuZbGK27RR2tf4BLal1V9TC9M3My2TcySQ7mSQGQVpaKBRK2VoEK10vimL1VHpo8WAVBU-FHvTgZaHtqRT8c-gfPHTSk_C5_H58vu_x4Ptu_EmGOz7BycUbz_m_N79ydAOEnG4RErlEhoOObzQ3EUKq2Oo0qM1mT7WYzfPdXp52W7OONasW1HLesYp50-yqcbIldEmEkC0fEjJUGSRJLNbx3Rb1aWPGYkbHTrw2b9SMosGoSS3LNMyyWizMlQ1WqZUqlBq756haU3eXmMmF6XUSoa5LZNN2dKUcNOd7jsV0O9wxv6-z04FuUn-wq_lNL3BZLSAKU9TiyorSOmUMWCkNaCshvXJhAFNC-nP9EGrQjqWSocEzSHxn4Du2zXy94ev1lgLpL4iTmCCY-BmCDOFtCIcwlUFaRPoO0htIP0FmA6IH6VNIX0P6HrIE-QjkDyBfh3wL2ePI_4gZDjMKyBLiVcTPInEPyfeRPIux9zDZwPS_EDeQ-w35pyCvgrwJUkfqAvg40h8jswsZFVkP-R5GOYxeRuIzcCew7RFSx8F_Dv4eJr7A1EdI70D2BXInkPsJ0ZuI9cEfg_A6Er8jtRmpElIV8B748xh_gcwqMs8gGhC_gvgNxB8gvQv5DchNZIHsdmQfIreG3DXkHiOpInkb27JIX0byE0yuIv0M0yMY0jC0hGGK7cD4XozfhyBAWILwHaQS5Dxy_yB_EeQcyHmMPMfoOkbvIlpF9BdEnyJ2AfEvkQiQWEfiKrhN4N4CtwbuW3APUC4h-QBjf2DqDqbXkHkI8QjEx5D3IZUAH0VGwNY1jFDEziF2BZE4klmMnUFqFalfIcQgtMnIzoXDiwcPHdx_4Kjy8qC-PBTDnt1kXtcJK9RgXqAtH9P37FlW9cWma0lhuYK6psyrBanOHLseaEqhUpCo26pTrUbdNpNM2mA-1RaWq-pefUFX9UIhFLzwxwRO02tr7wxiUjtgzHc8m3q2y7TwuEbTYq7Puk47tLTDVUWy3aZBXZ_2Vli_zVY7zDNDU2qwgFo0oF3m_6-qyUh413_kgcvGugMAAA.webp"
          //src="https://www.vertumotors.com/new/vertu/car/volkswagen/id3/_0016s_0004s_0000_id3-pro-match-01%5E1024x768%5E.jpg"
          alt="Volkswagen ID.3"
          style={{ width: '200px', borderRadius: '8px' }}
        />
      </div>
      <div>
        <h2 style={{ margin: '0 0 10px 0', color: '#868686' }}>Bonjour, {userName} !</h2>
        <p style={{ margin: '0', fontSize: '18px' }}>
          Votre véhicule préféré : <strong>{vehicleModel}</strong> (<span style={{ color: '#007bff' }}>{vehicleColor}</span>)
        </p>
      </div>
    </div>
  );
};

export default UserVehicleHeader;
