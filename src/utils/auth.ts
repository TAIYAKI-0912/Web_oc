// utils/auth.ts（新規作成）
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; // ← 既存の firebase.ts から読み込む！

const provider = new GoogleAuthProvider();

// 管理者ログイン処理
export async function loginAsAdmin(): Promise<boolean> {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    if (!email) return false;

    // Firestoreの allowed_admins にメアドがあるか確認
    const adminDoc = await getDoc(doc(db, "allowed_admins", email));
    if (adminDoc.exists()) {
      return true; // 管理者OK
    } else {
      alert("管理者権限がありません");
      await signOut(auth);
      return false;
    }
  } catch (error) {
    console.error("ログインエラー:", error);
    return false;
  }
}

// ログアウト処理
export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

// 次期管理者の追加
export async function addNextAdmin(nextEmail: string): Promise<void> {
  await setDoc(doc(db, "allowed_admins", nextEmail), {
    addedAt: new Date(),
    addedBy: auth.currentUser?.email
  });
}
