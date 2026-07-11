import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../auth';
import { auth as authApi } from '../../api';
import {
  Alert,
  Button,
  Card,
  Field,
  FormStack,
  Input,
  Muted,
  SectionLead,
  SectionTitle,
} from '../../components/ui';

export function ProfileCard() {
  const { user, updateName } = useAuth();

  // Display name
  const [name, setName] = useState(user?.name ?? '');
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameBusy, setNameBusy] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  if (!user) return null;

  async function onSaveName(e: FormEvent) {
    e.preventDefault();
    setNameError(null);
    setNameSaved(false);
    setNameBusy(true);
    try {
      await updateName(name.trim());
      setNameSaved(true);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Could not save your name.');
    } finally {
      setNameBusy(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwMessage(null);
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwBusy(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPwMessage('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Could not change your password.');
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <Card>
      <SectionTitle>Profile</SectionTitle>
      <SectionLead>Your identity across every ruudjuffermans.nl app.</SectionLead>

      <FormStack as="div">
        <Field as="div">
          Email
          <Input type="email" value={user.isGuest ? 'Guest account' : user.email} disabled />
          {!user.isGuest && !user.emailVerified && <Muted>Not verified yet.</Muted>}
        </Field>

        <NameForm onSubmit={onSaveName}>
          <Field>
            Display name
            <Input
              type="text"
              autoComplete="name"
              placeholder="How should we address you?"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameSaved(false);
              }}
            />
          </Field>
          <Button type="submit" disabled={nameBusy || name === (user.name ?? '')}>
            {nameBusy ? 'Saving…' : nameSaved ? 'Saved' : 'Save'}
          </Button>
        </NameForm>
        {nameError && <Alert $variant="error">{nameError}</Alert>}
      </FormStack>

      {!user.isGuest && (
        <>
          <Divider />
          <SubTitle>Change password</SubTitle>
          <FormStack onSubmit={onChangePassword}>
            {pwError && <Alert $variant="error">{pwError}</Alert>}
            {pwMessage && <Alert $variant="success">{pwMessage}</Alert>}
            <Field>
              Current password
              <Input
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <PwRow>
              <Field>
                New password
                <Input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Muted>Min 8 characters.</Muted>
              </Field>
              <Field>
                Confirm new password
                <Input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
            </PwRow>
            <div>
              <Button type="submit" disabled={pwBusy}>
                {pwBusy ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </FormStack>
        </>
      )}
    </Card>
  );
}

const NameForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  > label {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PwRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: var(--app-divider);
  margin: 24px 0;
`;

const SubTitle = styled.h3`
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
`;
