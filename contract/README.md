# ハッカソン用コントラクト

### コントラクト概要説明
- AdministerNFT: 運営権のNFTコントラクト
- MemberNFT: ReCreation参加証コントラクト
- BadgeNFT: 経験や実績NFTコントラクト
- MemberRegistry: ReCreationの参加メンバー管理コントラクト
- CoreGorvernor: 運営メンバー内での投票コントラクト、AdministerNFTをガバナンスとすることを想定
- PjGovernor: PJDAO内での投票コントラクト、MemberNFTをガバナンスとすることを想定
- PjDAO: PJ DAOコントラクト
- PjDAOFactory: PJ DAOのFactoryコントラクト


### 立ち上げ手順
```shell
// node立ち上げ
npm run node

// 開発環境へcontractデプロイ
npm run dev
```

